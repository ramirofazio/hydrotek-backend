import { Module } from "@nestjs/common";
import { TfacturaService } from "./tfactura.service";
import { HttpModule } from "@nestjs/axios";
import { PrismaModule } from "src/prisma/prisma.module";
import { AfipModule } from "src/afip/afip.module";
import { TfacturaController } from "./tfactura.controller";
import { ApidolarModule } from "src/apidolar/apidolar.module";


@Module({
  imports: [HttpModule.register({
    timeout: 30000,
    maxRedirects: 5,
  }), PrismaModule, AfipModule, ApidolarModule],
  providers: [TfacturaService],
  exports: [TfacturaService],
  controllers: [TfacturaController],
})
export class TfacturaModule {}
