import { Test, TestingModule } from "@nestjs/testing";
import { TfacturaController } from "./tfactura.controller";

describe("TfacturaController", () => {
  let controller: TfacturaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TfacturaController],
    }).compile();

    controller = module.get<TfacturaController>(TfacturaController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
