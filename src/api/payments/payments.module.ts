import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './models/schemas/payment.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports:[PaymentsService]
})
export class PaymentsModule {}
