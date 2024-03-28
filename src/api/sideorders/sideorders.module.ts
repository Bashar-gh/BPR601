import { Module } from '@nestjs/common';
import { SideordersController } from './sideorders.controller';
import { SideordersService } from './sideorders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SideOrder, SideOrderSchema } from './models/schema/sideorder.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: SideOrder.name, schema: SideOrderSchema }])],
  controllers: [SideordersController],
  providers: [SideordersService],
  exports:[SideordersService],
})
export class SideordersModule {}
