import { Reservable } from "../schemas/reservable.schema"

export type ReservableListItem = {
    id: string,
    image: number,
    name: string,
    avg_review: number,
    review_count: number,
}
export const mapReservableItem = (e: Reservable) => { return { id: e.id, name: e.name, image: e.image, avg_review: e.reviewSum.avg, review_count: e.reviewSum.count }; };