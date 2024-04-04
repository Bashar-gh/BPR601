import { Role } from "src/auth/enums/role.enum";
import { User } from "../schemas/user.schema";

export type UserListItem = {
    id:string,
    email: string,
    fullname: string,
    type: Role,
};
export const mapUserListItem = (user: User): UserListItem => {
    return {
        id:user.id,
        email: user.email,
        fullname: `${user.firstName} ${user.lastName}`,
        type: user.type,
    };
};