import { Module } from "@nestjs/common";
import { TfacturaService } from "./tfactura.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule.register({
    timeout: 30000,
    maxRedirects: 5,
  })],
  providers: [TfacturaService],
  exports: [TfacturaService],
})
export class TfacturaModule {}
