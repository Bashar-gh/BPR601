import { Test, TestingModule } from '@nestjs/testing';
import { ReservableController } from './reservable.controller';

describe('ReservableController', () => {
  let controller: ReservableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservableController],
    }).compile();

    controller = module.get<ReservableController>(ReservableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
