import { Injectable } from '@nestjs/common';
import { Payment, PaymentDocument } from './models/schemas/payment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentMethod } from './models/enums/payment_method.enum';
import '../../global/extensions/string.extensions';
import { ArrayReturn } from 'src/global/models/dtos/return_type.dto';
import { mapPaymentListItem, PaymentListItem } from './models/types/payment_list_item.type';
import { mapPaymentDetails, PaymentDetails } from './models/types/payment_details.type';
import NotFound from 'src/global/errors/not_found.error';
@Injectable()
export class PaymentsService {

    constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) { }

    async create(reservationId: string, amount: number, paymentType: PaymentMethod): Promise<Payment> {
        let data = new this.paymentModel({ reservationId: reservationId.toObjectID(), amount: amount, paymentMethod: paymentType });
        let saved = await data.save();
        return saved;
    }
    async getAll(): Promise<ArrayReturn<PaymentListItem>> {
        let query = this.paymentModel.find();
        query.populate({
            path: "reservationId",
            populate: {
                path: "userId",
            }
        });
        let data = await query.exec();
        return {
            ARRAY: data.map(mapPaymentListItem)
        }
    }
    async getDetails(id: string): Promise<PaymentDetails> {
        let query = this.paymentModel.findById(id);
        query.populate({
            path: "reservationId",
            populate: ["userId", "reservableId"]
        });
        let data = await query.exec();
        if (!data) {
            throw new NotFound(Payment);
        }
        return mapPaymentDetails(data);
    }
}
