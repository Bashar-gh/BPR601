import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { ServiceType } from "../enum/service_type.enum";

export class CreateReservableDTO {

    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsString()
    address: string;
    @IsNotEmpty()
    @IsString()
    description: string;
    @IsNotEmpty()
    @IsEnum(ServiceType)
    serviceType: ServiceType;
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    image: number;
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    capacity: number;
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    commission:number;

}