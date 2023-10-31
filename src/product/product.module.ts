import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { TfacturaService } from "src/tfactura/tfactura.service";
import { TfacturaModule } from "src/tfactura/tfactura.module";

@Module({
  imports: [PrismaModule, TfacturaModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {}
