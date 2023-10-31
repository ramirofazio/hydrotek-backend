import { Controller, Get, Body, Param, Delete, Put } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Response } from "src/commonDTO";
import { UpdateCartDTO } from "./product.dto";

@Controller("product")
export class ProductController {
  /* eslint-disable */
  constructor(private productService: ProductService) {}
  /* eslint-enable */

  @Get()
  async updateDBProducts() {
    return await this.productService.updateDBProducts();
  }

  /* @Put()
  async updateCart(@Body() data: UpdateCartDTO): Promise<Response> {
    return await this.shoppingCartService.loadCart(data);
  }

  @Get(":id")
  findbyId(@Param("id") userId: string): Promise<Response> {
    return this.shoppingCartService.findById(userId);
  }

  @Delete(":id")
  cleanCart(@Param("id") userId: string): Promise<string> {
    return this.shoppingCartService.cleanCart(userId);
  } */
}
