import { Module } from "@nestjs/common";
import { ShoppingCartService } from "./shoppingCart.service";
import { ShoppingCartController } from "./shoppingCart.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
})
export class ShoppingCartModule {}
