import { Test, TestingModule } from '@nestjs/testing';
import { SideordersService } from './sideorders.service';

describe('SideordersService', () => {
  let service: SideordersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SideordersService],
    }).compile();

    service = module.get<SideordersService>(SideordersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
