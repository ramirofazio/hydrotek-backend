import { Test, TestingModule } from '@nestjs/testing';
import { ApidolarService } from './apidolar.service';

describe('ApidolarService', () => {
  let service: ApidolarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApidolarService],
    }).compile();

    service = module.get<ApidolarService>(ApidolarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
