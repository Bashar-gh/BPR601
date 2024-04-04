import { Controller, Get, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ArrayReturn } from 'src/global/models/dtos/return_type.dto';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { PaymentListItem } from './models/types/payment_list_item.type';
import { PaymentDetails } from './models/types/payment_details.type';

@Roles(Role.Admin)
@Controller('api/payments')
export class PaymentsController {

    constructor(private paymentService: PaymentsService) { }
    @Get('')
    async getAll(): Promise<ArrayReturn<PaymentListItem>> {
        return this.paymentService.getAll();
    }
    @Get(':id')
    async getDetails(@Param('id') id: string): Promise<PaymentDetails> {
        return this.getDetails(id);
    }
}
