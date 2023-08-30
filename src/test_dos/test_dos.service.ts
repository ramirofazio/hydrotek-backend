import { Injectable } from "@nestjs/common";
import { TestUnoService } from "src/test_uno/test_uno.service";

@Injectable()
export class TestDosService {
  constructor(private readonly productService: TestUnoService) {}
  async manageTestUnos() {
    const products = await this.productService.getTestUnos();
    return { user: "test", products };
  }
}
