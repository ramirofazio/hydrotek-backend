import { Module } from "@nestjs/common";
import { AfipService } from "./afip.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule.register({
    timeout: 30000,
    maxRedirects: 5,
  })],
  providers: [AfipService],
  exports: [AfipService]
})
export class AfipModule {}