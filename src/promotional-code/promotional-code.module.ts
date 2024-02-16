import { Module } from "@nestjs/common";
import { PromotionalCodeService } from "./promotional-code.service";
import { PromotionalCodeController } from "./promotional-code.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [PromotionalCodeService],
  controllers: [PromotionalCodeController],
})
export class PromotionalCodeModule {}
