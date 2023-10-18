import { Controller, Get } from "@nestjs/common";
import { TfacturaService } from "./tfactura.service";

@Controller("tfactura")
export class TfacturaController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly TfacturaService: TfacturaService) {}



  @Get("token")
  async getToken() {
    return await this.TfacturaService.postToken();
  }

  @Get("products")
  async getProducts() {
    return await this.TfacturaService.postProducts();
  }
}
