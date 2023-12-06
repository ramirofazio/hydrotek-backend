import { Test, TestingModule } from "@nestjs/testing";
import { ApidolarController } from "./apidolar.controller";

describe("ApidolarController", () => {
  let controller: ApidolarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApidolarController],
    }).compile();

    controller = module.get<ApidolarController>(ApidolarController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
