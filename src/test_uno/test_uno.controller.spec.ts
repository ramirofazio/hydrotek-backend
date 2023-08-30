import { Test, TestingModule } from '@nestjs/testing';
import { TestUnoController } from './test_uno.controller';

describe('TestUnoController', () => {
  let controller: TestUnoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestUnoController],
    }).compile();

    controller = module.get<TestUnoController>(TestUnoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
