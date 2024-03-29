import { SideOrder } from "../schema/sideorder.schema"

export type SideOrderListItem = {
    id: string,
    image: number,
    name: string,
    avg_review: number,
    review_count: number,
}
export const mapSideOrderItem = (e: SideOrder) => { return { id: e.id, name: e.name, image: e.image, avg_review: e.reviewSum.avg, review_count: e.reviewSum.count }; };