import { Module } from "@nestjs/common";
import { ApidolarService } from "./apidolar.service";
import { ApidolarController } from "./apidolar.controller";
import { HttpModule } from "@nestjs/axios";
import { PrismaModule } from "src/prisma/prisma.module";
@Module({
  imports: [HttpModule.register({
    timeout: 30000,
    maxRedirects: 5,
  }), PrismaModule],
  providers: [ApidolarService],
  controllers: [ApidolarController],
  exports: [ApidolarService]
})
export class ApidolarModule {}
