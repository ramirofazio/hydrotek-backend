import { Module } from "@nestjs/common";
import { TestUnoController } from "./test_uno.controller";
import { TestUnoService } from "./test_uno.service";

@Module({
  controllers: [TestUnoController],
  providers: [TestUnoService],
  exports: [TestUnoService],
})
export class TestUnoModule {}
