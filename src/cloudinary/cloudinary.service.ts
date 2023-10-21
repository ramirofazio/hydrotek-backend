import { Injectable, UseInterceptors } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { v2 as cloudinary } from "cloudinary";
import { env } from "process";
import * as fs from "fs";


@Injectable()
export class CloudinaryService {
  /* eslint-disable */
  constructor(private prisma: PrismaService) {}
  /* eslint-enable */

  config() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: false,
    });
  }

  async updateAvatar({ file, userId }) {
    try {
      console.log("paramss---");

      fs.readFile(file, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });

      console.log(file);
      console.log(userId);

      /* this.config();
      const result = await cloudinary.uploader.upload(file, {
        upload_preset: "user_avatar",
        public_id: userId,
        overwrite: true,
      });
      console.log(result);
      return result; */
    } catch (e) {
      console.log(e);
    }
  }
}
