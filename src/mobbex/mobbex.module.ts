import { Module } from "@nestjs/common";
import { MobbexService } from "./mobbex.service";
import { MobbexController } from "./mobbex.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { TfacturaModule } from "src/tfactura/tfactura.module";
import { UserModule } from "src/user/user.module";
import { ShoppingCartModule } from "src/shoppingCart/shoppingCart.module";

@Module({
  providers: [MobbexService],
  controllers: [MobbexController],
  exports: [MobbexService],
  imports: [PrismaModule, TfacturaModule, UserModule, ShoppingCartModule],
})
export class MobbexModule {}
