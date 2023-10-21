import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";
//import { UpdateAvatarDTO } from "./cloudinary.DTO";

@Controller("cloudinary")
export class CloudinaryController {
  /* eslint-disable */
  constructor(private cloudinaryService: CloudinaryService) {}
  /* eslint-enable */
  @Post("updateAvatar")
  updateAvatar(@Body() body: any) {
    this.cloudinaryService.updateAvatar(body);
  }
}
