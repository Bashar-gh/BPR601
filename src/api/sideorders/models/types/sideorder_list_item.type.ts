import { SideOrderType } from "../enums/sideorder_type.enum";
import { SideOrder } from "../schema/sideorder.schema"

export type SideOrderListItem = {
    id: string,
    image: number,
    name: string,
    avg_review: number,
    review_count: number,
    type:SideOrderType
}
export const mapSideOrderItem = (e: SideOrder):SideOrderListItem => { return { id: e.id, name: e.name, image: e.image, avg_review: e.reviewSum.avg,type:e.orderType, review_count: e.reviewSum.count }; };