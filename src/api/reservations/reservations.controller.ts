import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDTO } from './models/dtos/create_reservation.dto';
import { ReservationDetails } from './models/types/reservation_details.type';
import { JWT_Data } from 'src/auth/types/jwt-data.type';
import { ArrayReturn } from 'src/global/models/dtos/return_type.dto';
import { ReservationListItem } from './models/types/reservation_list_item.type';
import { AvailableDay } from './models/types/available_day_slot.type';
import { TimeSlot } from './models/types/available_time_slot.type';

@Controller('api/reservations')
export class ReservationsController {

    constructor(private reservationService: ReservationsService) { }
    @Post(":serviceId")
    async createReservation(@Body() dto: CreateReservationDTO, @Req() request: any, @Param('serviceId') serviceId: string): Promise<ReservationDetails> {
        let payload: JWT_Data = request.payload;
        return this.reservationService.createReservation(dto, payload.userId, serviceId);
    }
    @Get("")
    async getMyReservations(@Req() request: any,): Promise<ArrayReturn<ReservationListItem>> {
        let payload: JWT_Data = request.payload;
        return this.reservationService.getMyReservations(payload.userId);
    }
    @Get(":serviceId")
    async getReservationDetails(@Param("serviceId") reservableId: string): Promise<ReservationDetails> {
        return this.reservationService.getReservationDetails(reservableId);
    }
    @Get("week/:serviceId")
    async getDaysWithAvailableTime(@Param("serviceId") reservableId: string): Promise<ArrayReturn<AvailableDay>> {
       return this.reservationService.getDaysWithAvailableTime(reservableId);

    }
    @Get("day/:serviceId")
    async getAvailableTimesForDay(@Param("serviceId") reservableId: string,@Query("day") day: string): Promise<ArrayReturn<TimeSlot>> {
       return this.reservationService.getAvailableTimesForDay(reservableId,day);
    }
}
