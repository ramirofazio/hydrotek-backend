import { Body, Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";
//import { UpdateAvatarDTO } from "./cloudinary.DTO";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("cloudinary")
export class CloudinaryController {
  /* eslint-disable */
  constructor(private cloudinaryService: CloudinaryService) {}
  /* eslint-enable */
  @Get("signature")
  getSignature() {
    return this.cloudinaryService.getSignature();
  }

  @Post("updateAvatar")
  @UseInterceptors(FileInterceptor("file"))
  async updateAvatar(@Body() body: { file: string; userId: string }) {
    return await this.cloudinaryService.updateAvatar(body);
  }

  @Post("loadProductImage")
  @UseInterceptors(FileInterceptor("file"))
  async loadProductImage(@Body() body: { file: string; productId: string }) {
    return await this.cloudinaryService.loadProductImage(body);
  }
}
