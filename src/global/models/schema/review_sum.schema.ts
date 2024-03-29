import { Prop } from "@nestjs/mongoose";

export class ReviewSum {
    @Prop({ type: Number, min: 0, max: 5, required: true })
    avg: number;
    @Prop({ type: Number, min: 0, required: true })
    count: number;
}