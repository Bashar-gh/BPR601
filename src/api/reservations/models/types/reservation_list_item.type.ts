import { Reservable } from "src/api/reservable/models/schemas/reservable.schema";
import { Reservation } from "../schemas/reservation.schema";
import { User } from "src/api/users/models/schemas/user.schema";

export type ReservationListItem = {

    id: string;
    date: Date;
    time: number;
    duration: number;
    user_name: string;
    reservable_name: string;
    cost: number;
}
export const mapReservationListItem = (e:Reservation):ReservationListItem =>{
    let user = e.userId as User;
    let reservable = e.reservableId as Reservable;
    let cost = e.price;
    for (let i = 0; i < e.sideOrders.length; i++) {
        cost += e.sideOrders[i].count * e.sideOrders[i].price;
        
    }
    return {
        id:e.id,
        date:e.date,
        time:e.time,
        duration:e.duration,

        user_name:`${user.firstName} ${user.lastName}`,
        reservable_name:reservable.name,
        cost:cost
    };
}