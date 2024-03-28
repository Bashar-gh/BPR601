import { Test, TestingModule } from '@nestjs/testing';
import { ReservableService } from './reservable.service';

describe('ReservableService', () => {
  let service: ReservableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservableService],
    }).compile();

    service = module.get<ReservableService>(ReservableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
