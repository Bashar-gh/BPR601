import { Test, TestingModule } from '@nestjs/testing';
import { SideordersController } from './sideorders.controller';

describe('SideordersController', () => {
  let controller: SideordersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SideordersController],
    }).compile();

    controller = module.get<SideordersController>(SideordersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
