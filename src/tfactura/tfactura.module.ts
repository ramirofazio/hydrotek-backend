import { Module } from "@nestjs/common";
import { TfacturaService } from "./tfactura.service";
import { HttpModule } from "@nestjs/axios";
import { PrismaModule } from "src/prisma/prisma.module";


@Module({
  imports: [HttpModule.register({
    timeout: 30000,
    maxRedirects: 5,
  }), PrismaModule],
  providers: [TfacturaService],
  exports: [TfacturaService],
})
export class TfacturaModule {}
