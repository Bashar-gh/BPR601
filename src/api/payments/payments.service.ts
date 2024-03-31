import { Injectable } from '@nestjs/common';
import { Payment, PaymentDocument } from './models/schemas/payment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentMethod } from './models/enums/payment_method.enum';
import '../../global/extensions/string.extensions';
@Injectable()
export class PaymentsService {

    constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) { }

    async create(reservationId: string, amount: number, paymentType: PaymentMethod): Promise<Payment> {
        let data = new this.paymentModel({ reservationId: reservationId.toObjectID(), amount: amount, paymentMethod: paymentType });
        let saved = await data.save();
        return saved;
    }
}
