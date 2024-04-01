import { Gender } from "../../enums/gender.enum";
import { User } from "../schemas/user.schema";

export type UserDetails = {
    id: string,
    fullName: string,
    email: string,
    phone: string,
    gender: Gender,
};
export const mapUserDetails = (user: User): UserDetails => {
    return {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
    };
}