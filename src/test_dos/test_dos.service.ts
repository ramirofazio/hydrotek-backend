
import { Injectable } from "@nestjs/common";
import { TestUnoService } from "src/test_uno/test_uno.service";
import { TfacturaService } from "src/tfactura/tfactura.service";

@Injectable()
export class TestDosService {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly productService: TestUnoService, private readonly TfacturaService: TfacturaService) {}
  async manageTestUnos() {
    const products = await this.productService.getTestUnos();
    return { user: "test", products };
  }
  // async getToken() {
  //   const token = await this.TfacturaService.getToken();
  //   return { token };
  // }
  // async getProducts() {
  //   const products = await this.TfacturaService.getProducts();
  //   return products;
  // }
}
