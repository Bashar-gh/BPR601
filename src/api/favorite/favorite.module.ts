import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { Favorite, FavoriteSchema } from './models/schemas/favotire.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forFeature([{ name: Favorite.name, schema: FavoriteSchema }])],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports:[FavoriteService]
})
export class FavoriteModule {}
