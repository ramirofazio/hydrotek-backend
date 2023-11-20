import { Module } from "@nestjs/common";
import { MobbexService } from "./mobbex.service";
import { MobbexController } from "./mobbex.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  providers: [MobbexService],
  controllers: [MobbexController],
  exports: [MobbexService],
  imports: [PrismaModule]
})
export class MobbexModule {}
