import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDTO } from './models/dtos/create_reservation.dto';
import { ReservationDetails } from './models/types/reservation_details.type';
import { JWT_Data } from 'src/auth/types/jwt-data.type';
import { ArrayReturn } from 'src/global/models/dtos/return_type.dto';
import { ReservationListItem } from './models/types/reservation_list_item.type';
import { AvailableDay } from './models/types/available_day_slot.type';
import { TimeSlot } from './models/types/available_time_slot.type';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { StatusDTO } from 'src/global/models/dtos/status.dto';

@Controller('api/reservations')
export class ReservationsController {

    constructor(private reservationService: ReservationsService) { }
   
    @Post(":serviceId")
    async createReservation(@Body() dto: CreateReservationDTO, @Req() request: any, @Param('serviceId') serviceId: string): Promise<ReservationDetails> {
        let payload: JWT_Data = request.payload;
        return this.reservationService.createReservation(dto, payload.userId, serviceId);
    }
    @Roles(Role.User,Role.Admin)
    @Get("me")
    async getMyReservations(@Req() request: any,): Promise<ArrayReturn<ReservationListItem>> {
        let payload: JWT_Data = request.payload;
        return this.reservationService.getMyReservations(payload.userId);
    }
    @Roles(Role.Owner,Role.Admin)
    @Get("Owner/me")
    async getMyReservationsOwner(@Req() request: any,): Promise<ArrayReturn<ReservationListItem>> {
        let payload: JWT_Data = request.payload;
        return this.reservationService.getMyReservationsOwner(payload.userId);
    }
    @Roles(Role.Admin)
    @Get("")
    async getAll(): Promise<ArrayReturn<ReservationListItem>> {
        return this.reservationService.getAll();
    }
    @Get(":reservationId")
    async getReservationDetails(@Param("reservationId") reservationId: string): Promise<ReservationDetails> {
        return this.reservationService.getReservationDetails(reservationId);
    }
    @Get("week/:serviceId")
    async getDaysWithAvailableTime(@Param("serviceId") reservableId: string): Promise<ArrayReturn<AvailableDay>> {
       return this.reservationService.getDaysWithAvailableTime(reservableId);

    }
    @Get("day/:serviceId")
    async getAvailableTimesForDay(@Param("serviceId") reservableId: string,@Query("day") day: string): Promise<ArrayReturn<TimeSlot>> {
       return this.reservationService.getAvailableTimesForDay(reservableId,day);
    }
    @Roles(Role.Admin)
    @Delete(":id")
    async cancelReservation(@Param('id')id: string): Promise<StatusDTO> {
        return this.reservationService.cancelReservation(id);
    }
    @Roles(Role.Admin)
    @Delete("removeOrder/:id/:orderId")
    async removeOrder(@Param('id')id: string,@Param("orderId") orderId:string): Promise<StatusDTO> {
        return this.reservationService.removeSideOrder(id,orderId);
    }
}
