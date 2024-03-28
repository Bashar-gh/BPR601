import { UserStatus } from "../../api/users/enums/user-status.enum";
import { Role } from "../enums/role.enum";

export type JWT_Data = { userId: string, accountStatus: UserStatus, role: Role};