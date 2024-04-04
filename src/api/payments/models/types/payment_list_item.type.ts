import { Reservation } from "src/api/reservations/models/schemas/reservation.schema";
import { PaymentMethod } from "../enums/payment_method.enum";
import { Payment } from "../schemas/payment.schema";
import { User } from "src/api/users/models/schemas/user.schema";

export type PaymentListItem = {
    amount: number,
    paymentMethod: PaymentMethod,
    user_name: string,
    date: Date,
}
export const mapPaymentListItem = (payment: Payment): PaymentListItem => {
    let reservation = payment.reservationId as Reservation;
    let user = reservation.userId as User;
    return {
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        user_name: `${user.firstName} ${user.lastName}`,
        date: reservation.date,
    };
}