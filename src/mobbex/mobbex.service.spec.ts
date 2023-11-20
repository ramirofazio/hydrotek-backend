import { Test, TestingModule } from "@nestjs/testing";
import { MobbexService } from "./mobbex.service";

describe("MobbexService", () => {
  let service: MobbexService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MobbexService],
    }).compile();

    service = module.get<MobbexService>(MobbexService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
