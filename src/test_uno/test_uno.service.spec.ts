import { Test, TestingModule } from "@nestjs/testing";
import { TestUnoService } from "./test_uno.service";

describe("TestUnoService", () => {
  let service: TestUnoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestUnoService],
    }).compile();

    service = module.get<TestUnoService>(TestUnoService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
