import { Injectable } from '@nestjs/common';
import { Reservation, ReservationDocument } from './models/schemas/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArrayReturn } from 'src/global/models/dtos/return_type.dto';
import { TimeSlot } from './models/types/available_time_slot.type';
import { AvailableDay } from './models/types/available_day_slot.type';
import { mapReservationDetails, ReservationDetails } from './models/types/reservation_details.type';
import { mapReservationListItem, ReservationListItem } from './models/types/reservation_list_item.type';
import '../../global/extensions/string.extensions';
import { CreateReservationDTO } from './models/dtos/create_reservation.dto';
import { SideordersService } from '../sideorders/sideorders.service';
import { PaymentsService } from '../payments/payments.service';
import { ReservationSideOrder } from './models/schemas/reservation_sideorder.schema';
import { ReservableService } from '../reservable/reservable.service';
import { mapReservableDetails } from '../reservable/models/types/reservable_details.type';
import NotFound from 'src/global/errors/not_found.error';
import { SideOrder } from '../sideorders/models/schema/sideorder.schema';
import { StatusDTO } from 'src/global/models/dtos/status.dto';
type MainReservationData = Omit<CreateReservationDTO, 'payment_method' | 'sideOrders'>
@Injectable()
export class ReservationsService {
    constructor(@InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
        private siderOrdersService: SideordersService,
        private paymentService: PaymentsService,
        private reservableService: ReservableService
    ) { }
    private startHour: number = 9;
    private endHour: number = 21;
    async createReservation(dto: CreateReservationDTO, userId: string, serviceId: string): Promise<ReservationDetails> {
        let mainData: MainReservationData = { ...dto };
        let prices = await this.siderOrdersService.getPrices(dto.sideOrders.map((e) => e.orderId));
        let cost = await this.reservableService.getPrice(serviceId);
        let servicePrice = cost;
        let orders: ReservationSideOrder[] = [];
        const capacity = await this.reservableService.getCapacity(serviceId);
        const usedCapacity = await this.usedCapForService(serviceId, dto.date);
        let leftCapacity = capacity - usedCapacity;
        if (dto.capacity > leftCapacity) {
            throw new Error("No Place Available ");
        }
        for (let order of dto.sideOrders) {
            let price = prices.find((p) => p.id.toString() == order.orderId.toString())?.price ?? 0;
            cost += price * order.count;
            orders.push({
                count: order.count,
                price: price,
                sideOrderId: order.orderId.toObjectID(),
            });
        }

        let data = new this.reservationModel({
            userId: userId.toObjectID(),
            reservableId: serviceId.toObjectID(),
            price: servicePrice,
            ...mainData,

            sideOrders: orders,
        });
        let saved = await data.save();
        let payment = await this.paymentService.create(saved.id, cost, dto.payment_method);

        return this.getReservationDetails(saved.id);
    }
    async getMyReservations(userId: string): Promise<ArrayReturn<ReservationListItem>> {
        let query = this.reservationModel.find({ userId: userId.toObjectID() });
        query.populate('userId');
        query.populate('reservableId');
        let reservations = await query.exec();
        return {
            ARRAY: reservations.map(mapReservationListItem)
        };
    }
    async getMyReservationsOwner(userId: string): Promise<ArrayReturn<ReservationListItem>> {
        let services = await this.reservableService.getOwner(userId);
        var ids = services.ARRAY.map((e) => e.id.toObjectID());
        let query = this.reservationModel.find({ reservableId: { $in: ids } });
        query.populate('userId');
        query.populate('reservableId');
        let reservations = await query.exec();
        return {
            ARRAY: reservations.map(mapReservationListItem)
        };
    }
    async getAll(): Promise<ArrayReturn<ReservationListItem>> {
        let query = this.reservationModel.find();
        query.populate('userId');
        query.populate('reservableId');
        let reservations = await query.exec();
        return {
            ARRAY: reservations.map(mapReservationListItem)
        };
    }
    async getReservationDetails(reservationId: string): Promise<ReservationDetails> {
        let query = this.reservationModel.findById(reservationId);
        query.populate('userId');
        query.populate('reservableId');
        query.populate({
            path: "sideOrders.sideOrderId",
            model: SideOrder.name
        });
        let data = await query.exec();
        if (!data) {
            throw new NotFound(Reservation);
        }
        return mapReservationDetails(data);
    }

    async getDaysWithAvailableTime(reservableId: string): Promise<ArrayReturn<AvailableDay>> {
        // Assuming we need to query reservations for the next 7 days
        const today = new Date();
        const next7Days = Array.from({ length: 7 }, (_, i) => new Date(today.getTime() + i * 24 * 60 * 60 * 1000));

        const daysWithAvailableTime: Date[] = [];
        const capacity = await this.reservableService.getCapacity(reservableId);
        for (const day of next7Days) {
            const reservations = await this.getReservationsForDay(reservableId, day);

            if (!reservations || reservations.length === 0) {
                daysWithAvailableTime.push(day);
                continue;
            }
            let reservedTimeSlots: number[] = [];
            let usedCapacity: number = 0;
            for (let reservation of reservations) {
                const startTime = reservation.time;
                const endTime = startTime + reservation.duration;
                usedCapacity += reservation.capacity;
                // Mark the time slots within the reservation duration as reserved
                for (let i = startTime; i < endTime; i++) {
                    reservedTimeSlots.push(i);
                }
            }
            if (usedCapacity >= capacity) {
                continue;
            }
            for (let i = this.startHour; i <= this.endHour; i++) {
                if (!reservedTimeSlots.includes(i)) {
                    daysWithAvailableTime.push(day);
                }
            }

        }

        return {
            ARRAY: next7Days.map((e): AvailableDay => {
                return {
                    day: e.toISOString(),
                    available: daysWithAvailableTime.includes(e),
                };
            }),
        };
    }

    async getAvailableTimesForDay(reservableId: string, day: string): Promise<ArrayReturn<TimeSlot>> {
        let dayDate = new Date(day);
        const reservations = await this.getReservationsForDay(reservableId, dayDate);

        const capacity = await this.reservableService.getCapacity(reservableId);
        let usedCapacity: number = await this.usedCapForService(reservableId, dayDate);

        const availableSlots: TimeSlot[] = [];
        if (usedCapacity >= capacity) {
            return {
                ARRAY: availableSlots,
            };
        }
        for (let i = this.startHour; i <= this.endHour; i++) {
            if (!reservations.find(reservation => reservation.time === i || reservation.time + reservation.duration >= i)) {
                var index = availableSlots.findIndex((e) => e.endTime == i);
                if (index != -1) {
                    availableSlots[index].endTime = i + 1
                    continue;
                }
                availableSlots.push({ startTime: i, endTime: i + 1 });
            }
        }

        return {
            ARRAY: availableSlots,
        };
    }
    async cancelReservation(id: string): Promise<StatusDTO> {
        await this.reservationModel.findByIdAndDelete(id).exec();
        return { Status: true };
    }
    async serviceDeleted(id: string): Promise<StatusDTO> {
        await this.reservationModel.deleteMany({ reservableId: id.toObjectID() }).exec();
        return { Status: true };
    }
    async sideOrderDeleted(id: string): Promise<StatusDTO> {
        let reservations = await this.reservationModel.find({ "sideOrders.sideOrderId": id.toObjectID() }).exec();
        for (let i = 0; i < reservations.length; i++) {
            const reservation = reservations[i];
            let order = reservation.sideOrders.find((e) => e.sideOrderId.toString() == id.toString()) ?? { count: 0, price: 0 };
            let discount = order.count * order.price;
            let newPrice = reservation.price = discount;
            await this.reservationModel.findByIdAndUpdate(reservation.id, {
                price: newPrice
            });

        }
        await this.reservationModel.updateMany({ "sideOrders.sideOrderId": id.toObjectID() },
            {
                $pull: { sideOrders: { sideOrderId: id.toObjectID() } }
            }).exec();

        return { Status: true };
    }
    async removeSideOrder(id: string, orderId: string): Promise<StatusDTO> {
        let reservation = await this.reservationModel.findById(id).exec();
        if (!reservation) {
            throw new NotFound(Reservation);
        }
        let index = reservation.sideOrders.findIndex((e) => e.sideOrderId.toString() == orderId.toString());
        let order = reservation.sideOrders[index];
        let discount = order.count * order.price;
        reservation.price = reservation.price - discount;
        reservation.sideOrders.splice(index, 1);
        await reservation.save();



        return { Status: true };
    }

    private async getReservationsForDay(serviceId: string, day: Date): Promise<Reservation[]> {
        return this.reservationModel.find({
            reservableId: serviceId.toObjectID(),
            date: { $gte: day, $lt: new Date(day.getTime() + 24 * 60 * 60 * 1000) },
        }).exec();
    }
    private async usedCapForService(serviceId: string, day: Date): Promise<number> {
        let data = await this.reservationModel.find({
            reservableId: serviceId.toObjectID(),
            date: { $gte: day, $lt: new Date(day.getTime() + 24 * 60 * 60 * 1000) },
        }).select('capacity').exec();
        let used: number = 0;
        for (let i = 0; i < data.length; i++) {
            const e = data[i];
            used += e.capacity;

        }
        return used;
    }


}
