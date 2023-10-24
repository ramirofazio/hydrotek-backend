import { Injectable, UseInterceptors } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { v2 as cloudinary } from "cloudinary";
import { env } from "process";
import * as fs from "fs";
import crypto from "crypto";

@Injectable()
export class CloudinaryService {
  /* eslint-disable */
  constructor(private prisma: PrismaService) {}
  /* eslint-enable */

  getSignature() {
    /* const timestamp = Math.round(new Date().getTime() / 1000);
    console.log(env.CLOUDINARY_API_SECRET);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        public_id: "cacatua",
        eager: "w_400,h_300,c_pad|w_260,h_200,c_crop",
        //upload_preset: "user_avatar",
      },
      `${env.CLOUDINARY_API_SECRET}`
    );
    console.log("im in");
    console.log(signature); */
    return { timestamp: "", signature: "" };
  }

  async updateAvatar(file: any) {
    try {
      const { timestamp, signature } = this.getSignature();
      const result = await cloudinary.uploader.upload("./testBorder.jpg", {
        upload_preset: "user_avatar",
        public_id: "cacatua",
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        overwrite: true,
      });
      console.log(result);
      return result;
    } catch (e) {
      console.log(e);
    }
  }
}
