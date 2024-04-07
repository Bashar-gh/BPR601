import { Test, TestingModule } from '@nestjs/testing';
import { RoleBackController } from './role-back.controller';

describe('RoleBackController', () => {
  let controller: RoleBackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleBackController],
    }).compile();

    controller = module.get<RoleBackController>(RoleBackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
