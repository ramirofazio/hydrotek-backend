import { Test, TestingModule } from "@nestjs/testing";
import { MobbexController } from "./mobbex.controller";

describe("MobbexController", () => {
  let controller: MobbexController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MobbexController],
    }).compile();

    controller = module.get<MobbexController>(MobbexController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
