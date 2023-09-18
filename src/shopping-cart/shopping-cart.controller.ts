import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ShoppingCartService } from "./shopping-cart.service";
import { ShoppingCart as cartModel } from "@prisma/client";

@Controller("shopping-cart")
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

 /*  @Post()
  create(@Body() createShoppingCartDto: cartModel) {
    return this.shoppingCartService.create(createShoppingCartDto);
  } */

  @Get()
  findAll() {
    //return this.shoppingCartService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.shoppingCartService.findOne(+id);
  }

  /* @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() cartModel: cartModel
  ) {
    return this.shoppingCartService.update(+id, cartModel);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.shoppingCartService.remove(+id);
  } */
}
