import { ServiceType } from "../enum/service_type.enum";
import { Reservable } from "../schemas/reservable.schema"

export type ReservableListItem = {
    id: string,
    image: number,
    name: string,
    avg_review: number,
    review_count: number,
    type:ServiceType,
}
export const mapReservableItem = (e: Reservable) => { return { id: e.id, name: e.name, image: e.image, avg_review: e.reviewSum.avg,type:e.serviceType, review_count: e.reviewSum.count }; };