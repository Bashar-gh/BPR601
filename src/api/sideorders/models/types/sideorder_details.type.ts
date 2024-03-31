import { SideOrderType } from "../enums/sideorder_type.enum";
import { SideOrder } from "../schema/sideorder.schema";

export type SideOrderDetails = {
    id: string,
    name: string,
    avg_review: number,
    review_count: number,
    description: string,
    price: number,
    type:SideOrderType,
    image:number,
};
export const mapSideOrderDetails = (order: SideOrder): SideOrderDetails => {
    return {
        id: order.id,
        name: order.name,
        avg_review: order.reviewSum.avg,
        review_count: order.reviewSum.count,
        description: order.description,
        price: order.price,
        type:order.orderType,
        image:order.image
    };
}