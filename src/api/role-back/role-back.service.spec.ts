import { Test, TestingModule } from '@nestjs/testing';
import { RoleBackService } from './role-back.service';

describe('RoleBackService', () => {
  let service: RoleBackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleBackService],
    }).compile();

    service = module.get<RoleBackService>(RoleBackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
