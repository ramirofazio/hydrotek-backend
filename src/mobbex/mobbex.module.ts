import { Module } from "@nestjs/common";
import { MobbexService } from "./mobbex.service";
import { MobbexController } from "./mobbex.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { TfacturaModule } from "src/tfactura/tfactura.module";

@Module({
  providers: [MobbexService],
  controllers: [MobbexController],
  exports: [MobbexService],
  imports: [PrismaModule, TfacturaModule]
})
export class MobbexModule {}
