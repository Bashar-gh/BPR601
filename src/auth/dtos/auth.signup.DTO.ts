import { IsDate, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, MaxLength, MinLength, Validate } from "class-validator";
import { Gender } from "src/api/users/enums/gender.enum";
import { Role } from "../enums/role.enum";

export class SignUpReqDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(7)
    password: string;

    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(25)
    firstName: string;

    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(35)
    lastName: string;
    @IsNotEmpty()
    @IsPhoneNumber()
    phone: string;
    
    @IsNotEmpty()
    @IsEnum(Gender)
    gender: Gender;
    @IsNotEmpty()
    @IsEnum(Role)
    
    role: Role;

    @IsNotEmpty()
    @IsDateString()
    dateOfBirth: string;


}
