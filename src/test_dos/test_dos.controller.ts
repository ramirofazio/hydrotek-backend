import { Controller, Get } from "@nestjs/common";
import { TestDosService } from "./test_dos.service";

@Controller("test_dos")
export class TestDosController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly testDosService: TestDosService) {}

  @Get()
  async manageTestUnos(): Promise<any> {
    return this.testDosService.manageTestUnos();
  }
}
