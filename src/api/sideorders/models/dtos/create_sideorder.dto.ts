import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { SideOrderType } from "../enums/sideorder_type.enum";

export class CreateSideOrderDTO {
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    image: number
    @IsNotEmpty()
    @IsEnum(SideOrderType)
    orderType: SideOrderType;
    @IsNotEmpty()
    @IsString()
    description: string;
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;
}