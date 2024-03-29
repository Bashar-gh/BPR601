import { Controller, Get, Param } from '@nestjs/common';
import { SideordersService } from './sideorders.service';
import { SideOrderListItem } from './models/types/sideorder_list_item.type';
import { SideOrderDetails } from './models/types/sideorder_details.type';

@Controller('sideorders')
export class SideordersController {

    constructor(private sideOrderService: SideordersService) { }
    @Get("mostPopular")
    async getMostPopular(): Promise<SideOrderListItem[]> {
        return this.sideOrderService.getMostPopular();
    }
    @Get(":id")
    async getDetails(@Param("id")id:string): Promise<SideOrderDetails> {
        return this.sideOrderService.getDetails(id);
    }
}
