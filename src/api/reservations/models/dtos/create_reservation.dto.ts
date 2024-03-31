import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min, ValidateNested } from "class-validator";
import { PaymentMethod } from "src/api/payments/models/enums/payment_method.enum";

export class CreateReservationDTO {

    @IsNotEmpty()
    @IsDate()
    date: Date;
    @IsNotEmpty()
    @IsNumber()
    @Min(9)
    @Max(21)
    time: number;
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(4)
    duration: number;
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    capacity: number;
    @IsNotEmpty()
    @IsArray()
    @ValidateNested()
    sideOrders: ReservationSideOrderDTO[];
    
    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    payment_method:PaymentMethod

}
export class ReservationSideOrderDTO {
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    count: number;
    @IsNotEmpty()
    @IsString()
    orderId: string;

}
