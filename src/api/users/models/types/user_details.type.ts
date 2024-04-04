import { Gender } from "../../enums/gender.enum";
import { UserStatus } from "../../enums/user-status.enum";
import { User } from "../schemas/user.schema";

export type UserDetails = {
    id: string,
    fullName: string,
    email: string,
    phone: string,
    gender: Gender,
    status:UserStatus
};
export const mapUserDetails = (user: User): UserDetails => {
    return {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        status:user.accountStatus,
    };
}