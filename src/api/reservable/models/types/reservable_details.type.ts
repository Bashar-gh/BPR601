import { ServiceType } from "../enum/service_type.enum";
import { Reservable } from "../schemas/reservable.schema";

export type ReservableDetails = {
    id: string,
    name: string,
    avg_review: number,
    review_count: number,
    adress: string,
    type:ServiceType,
    image:number,
    description: string,
    capacity:number,
    commission:number,
};
export const mapReservableDetails = (res: Reservable): ReservableDetails => {
    return { id: res.id, name: res.name,commission:res.commission, avg_review: res.reviewSum.avg,type:res.serviceType,image:res.image,capacity:res.capacity, review_count: res.reviewSum.count, adress: res.address, description: res.description };
};