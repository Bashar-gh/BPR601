import { User } from "src/api/users/models/schemas/user.schema";
import { Review } from "../schema/review.schema";

export type ReviewListItem = {
    id: string,
    name: string,
    rating: number,
    date: Date,
    details: string,
};
export const mapReviewListItem = (rev: Review) => {
    let user = rev.userId as User;
    return { id: rev.id, name: `${user.firstName} ${user.lastName}`, rating: rev.rating, date: rev.createdAt, details: rev.reviewText };
};