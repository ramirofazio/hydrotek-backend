import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { v2 as cloudinary } from "cloudinary";
import { env } from "process";


@Injectable()
export class CloudinaryService {
  /* eslint-disable */
  constructor(private prisma: PrismaService) {}
  /* eslint-enable */

  getSignature() { // ? en desuso, pero la podemos necesitar mas adelante
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        overwrite: true,
      },
      `${env.CLOUDINARY_API_SECRET}`
    );
    return { timestamp, signature };
  }

  async updateAvatar(body: any) {
    try {
      const { file, userId } = body;
      const result = await cloudinary.uploader.upload(file, {
        upload_preset: "user_avatar",
        public_id: userId,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        overwrite: true,
      });
      return result.secure_url;
    } catch (e) {
      console.log(e);
    }
  }
}
