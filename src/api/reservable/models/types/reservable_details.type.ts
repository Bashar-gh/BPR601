import { Reservable } from "../schemas/reservable.schema";

export type ReservableDetails = {
    id: string,
    name: string,
    avg_review: number,
    review_count: number,
    adress: string,
    description: string,
};
export const mapReservableDetails = (res: Reservable): ReservableDetails => {
    return { id: res.id, name: res.name, avg_review: res.reviewSum.avg, review_count: res.reviewSum.count, adress: res.address, description: res.description };
};