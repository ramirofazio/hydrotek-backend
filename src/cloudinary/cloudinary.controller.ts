import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";
//import { UpdateAvatarDTO } from "./cloudinary.DTO";
import { FileInterceptor } from "@nestjs/platform-express";
import { readFileSync } from "fs";

@Controller("cloudinary")
export class CloudinaryController {
  /* eslint-disable */
  constructor(private cloudinaryService: CloudinaryService) {}
  /* eslint-enable */
  @Get("signature")
  getSignature() {
    return this.cloudinaryService.getSignature();
  }

  // @Post("updateAvatar")
  // @UseInterceptors(FileInterceptor("file"))
  //  uploadFile(@UploadedFile() file: any) {
  //   /* const base64Data = readFileSync(file.buffer, "base64");
  //   const dataURL = `data:${file.mimetype};base64,${base64Data}`;

  //   console.log(dataURL); */
  //   console.log(file)
  //   //return await this.cloudinaryService.updateAvatar(file);
  // }
  //@UseInterceptors(FileInterceptor("body"))
  @Post("updateAvatar")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(/* @UploadedFile() file,  */@Body() body) {
    //console.log(file);
    console.log(body);
    return await this.cloudinaryService.updateAvatar(body);
  }
  updateAvatar(@Body() body: any) {
    this.cloudinaryService.updateAvatar(body);
  }
}
