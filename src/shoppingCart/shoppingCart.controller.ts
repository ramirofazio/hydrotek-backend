import { Controller, Get, Body, Param, Delete, Put } from "@nestjs/common";
import { ShoppingCartService } from "./shoppingCart.service";
import { Response } from "src/commonDTO";
import { UpdateCartDTO } from "./shoppingCartDTO";

@Controller("shoppingCart")
export class ShoppingCartController {
  /* eslint-disable */
  constructor(private shoppingCartService: ShoppingCartService) {}
  /* eslint-enable */

  @Get()
  async createMock() {
    return await this.shoppingCartService.createMock();
  }

  @Put()
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
  }
}
