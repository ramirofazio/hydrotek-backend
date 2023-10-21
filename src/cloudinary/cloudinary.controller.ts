import { Body, Controller, Get, Post, Put, UseInterceptors, UploadedFile } from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";
//import { UpdateAvatarDTO } from "./cloudinary.DTO";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("cloudinary")
export class CloudinaryController {
  /* eslint-disable */
  constructor(private cloudinaryService: CloudinaryService) {}
  /* eslint-enable */
  @Post("updateAvatar")
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
  updateAvatar(@Body() body: any) {
    this.cloudinaryService.updateAvatar(body);
  }
}
