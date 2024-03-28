import { IsDate, IsDateString, IsEmail, IsNotEmpty, MaxLength, MinLength, Validate } from "class-validator";

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
    @IsDateString()
    dateOfBirth: string;

  
}
