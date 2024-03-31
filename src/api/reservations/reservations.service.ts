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
type MainReservationData = Omit<CreateReservationDTO, 'payment_method' | 'sideOrders'>
@Injectable()
export class ReservationsService {
    constructor(@InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
        private siderOrdersService: SideordersService,
        private paymentService: PaymentsService,
        private reservableService:ReservableService
    ) { }
    private startHour: number = 9;
    private endHour: number = 21;
    async createReservation(dto: CreateReservationDTO, userId: string, serviceId: string): Promise<ReservationDetails> {
        let mainData: MainReservationData = { ...dto };
        let prices = await this.siderOrdersService.getPrices(dto.sideOrders.map((e) => e.orderId));
        let cost = await this.reservableService.getPrice(serviceId);
        let servicePrice = cost;
        let orders: ReservationSideOrder[] = [];
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
            userId: userId,
            reservableId: serviceId,
            price:servicePrice,
            ...mainData,

            sideOrders: orders,
        });
        let saved = await data.save();
        let payment = await this.paymentService.create(saved.id,cost,dto.payment_method);
         
        return this.getReservationDetails(saved.id);
    }
    async getMyReservations(userId: string): Promise<ArrayReturn<ReservationListItem>> {
        let reservations = await this.reservationModel.find({ userId: userId.toObjectID() }).exec();
        return {
            ARRAY: reservations.map(mapReservationListItem)
        };
    }
    async getReservationDetails(reservationId:string): Promise<ReservationDetails> {
        let query =  this.reservationModel.findById(reservationId);
        query.populate('userId');
        query.populate('reservableId');
        let data = await query.exec();
        if(!data){
            throw new NotFound(Reservation);
        }
        return mapReservationDetails(data);
    }

    async getDaysWithAvailableTime(reservableId: string): Promise<ArrayReturn<AvailableDay>> {
        // Assuming we need to query reservations for the next 7 days
        const today = new Date();
        const next7Days = Array.from({ length: 7 }, (_, i) => new Date(today.getTime() + i * 24 * 60 * 60 * 1000));

        const daysWithAvailableTime: Date[] = [];

        for (const day of next7Days) {
            const reservations = await this.reservationModel.find({
                reservableId: reservableId,
                date: { $gte: day, $lt: new Date(day.getTime() + 24 * 60 * 60 * 1000) },
            });

            if (!reservations || reservations.length === 0) {
                daysWithAvailableTime.push(day);
                continue;
            }
            let reservedTimeSlots: number[] = [];
            for (let reservation of reservations) {
                const startTime = reservation.time;
                const endTime = startTime + reservation.duration;

                // Mark the time slots within the reservation duration as reserved
                for (let i = startTime; i < endTime; i++) {
                    reservedTimeSlots.push(i);
                }
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
        const reservations = await this.reservationModel.find({
            reservableId: reservableId,
            date: { $gte: dayDate, $lt: new Date(dayDate.getTime() + 24 * 60 * 60 * 1000) },
        });

        // Assuming the venue operates from 9 AM to 9 PM with 1-hour time slots
        const availableSlots: TimeSlot[] = [];
        for (let i = this.startHour; i <= this.endHour; i++) {
            if (!reservations.find(reservation => reservation.time === i)) {
                availableSlots.push({ startTime: i, endTime: i + 1 });
            }
        }

        return {
            ARRAY: availableSlots,
        };
    }


}
