import { Reservation } from "src/api/reservations/models/schemas/reservation.schema";
import { PaymentMethod } from "../enums/payment_method.enum";
import { Payment } from "../schemas/payment.schema";
import { User } from "src/api/users/models/schemas/user.schema";
import { Reservable } from "src/api/reservable/models/schemas/reservable.schema";

export type PaymentDetails = {
    amount: number,
    paymentMethod: PaymentMethod,
    user_name: string,
    service_name:string,
    date: Date,
}
export const mapPaymentDetails = (payment: Payment): PaymentDetails => {
    let reservation = payment.reservationId as Reservation;
    let user = reservation.userId as User;
    let service = reservation.reservableId as Reservable;
    return {
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        user_name: `${user.firstName} ${user.lastName}`,
        service_name:service.name,
        date: reservation.date,
    };
}