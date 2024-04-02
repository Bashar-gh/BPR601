import { Reservable } from "src/api/reservable/models/schemas/reservable.schema";
import { User } from "src/api/users/models/schemas/user.schema";
import { Reservation } from "../schemas/reservation.schema";
import { mapSideOrderItem, SideOrderListItem } from "src/api/sideorders/models/types/sideorder_list_item.type";
import { ReservationSideOrder } from "../schemas/reservation_sideorder.schema";
import { SideOrder } from "src/api/sideorders/models/schema/sideorder.schema";
import { ServiceType } from "src/api/reservable/models/enum/service_type.enum";

export type ReservationDetails = {
    id: string;
    date: Date;
    time: number;
    duration: number;
    user_name: string;
    reservable_name: string;
    cost: number;
    image:number,
    type:ServiceType,
    sideOrders: ReservedSideOrderListItem[];
}
export const mapReservationDetails = (e: Reservation): ReservationDetails => {
    let user = e.userId as User;
    let reservable = e.reservableId as Reservable;
    let cost = e.price;
    for (let i = 0; i < e.sideOrders.length; i++) {
        cost += e.sideOrders[i].count * e.sideOrders[i].price;

    }
    return {
        id: e.id,
        date: e.date,
        time: e.time,
        duration: e.duration,
        type:reservable.serviceType,
        image:reservable.image,
        user_name: `${user.firstName} ${user.lastName}`,
        reservable_name: reservable.name,
        cost: cost,
        sideOrders:e.sideOrders.map(mapReservedSideOrderListItem)
    };
}
export type ReservedSideOrderListItem = SideOrderListItem & {
    count: number;
    price: number;

}
export const mapReservedSideOrderListItem = (e:ReservationSideOrder):ReservedSideOrderListItem=>{
    return {
        ...mapSideOrderItem(e.sideOrderId as SideOrder),
        count:e.count,
        price:e.price,
    };
}
