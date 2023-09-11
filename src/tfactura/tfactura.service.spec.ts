import { Test, TestingModule } from "@nestjs/testing";
import { TfacturaService } from "./tfactura.service";

describe("TfacturaService", () => {
  let service: TfacturaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TfacturaService],
    }).compile();

    service = module.get<TfacturaService>(TfacturaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
