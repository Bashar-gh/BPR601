import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateReviewDTO {



    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(5)
    rating: number;
    @IsNotEmpty()
    @IsString()
    @MaxLength(80)
    reviewText: string;
}