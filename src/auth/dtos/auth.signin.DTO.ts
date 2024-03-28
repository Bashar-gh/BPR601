import { UserStatus } from "../../api/users/enums/user-status.enum";
import { Role } from "../enums/role.enum";
import { IsEmail, IsNotEmpty, Validate } from "class-validator";

export class SignInReqDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

   
}

export type SignInResDTO = {
    id: string;
    display_name: string;
    user_email: string;
    jwt: string;
    user_status: UserStatus | undefined;
    user_role: Role;

}
