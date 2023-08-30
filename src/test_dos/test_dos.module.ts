import { Module } from "@nestjs/common";
import { TestDosController } from "./test_dos.controller";
import { TestDosService } from "./test_dos.service";
import { TestUnoModule } from "src/test_uno/test_uno.module";

@Module({
  imports: [TestUnoModule],
  controllers: [TestDosController],
  providers: [TestDosService],
})
export class TestDosModule {}
