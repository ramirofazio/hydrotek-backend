import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { CloudinaryService } from "./cloudinary.service";
import { CloudinaryController } from "./cloudinary.controller";

@Module({
  imports: [
    PrismaModule
  ],
  providers: [CloudinaryService],
  controllers: [CloudinaryController],
  exports: [CloudinaryService],
})

export class CloudinaryModule {}