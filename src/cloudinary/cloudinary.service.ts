import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { v2 as cloudinary } from "cloudinary";
import { env } from "process";

@Injectable()
export class CloudinaryService {
  /* eslint-disable */
  constructor(private prisma: PrismaService) {}
  /* eslint-enable */

  getSignature() {
    // ? en desuso, pero la podemos necesitar mas adelante
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

  async updateAvatar(body: { file: string; userId: string }) {
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

  async loadProductImage(body: { file: string; productId: string }) {
    try {
      const { file, productId } = body;
      console.log(file, productId);

      // Convert productId to an integer
      const productIdInt = parseInt(productId, 10);

      const result = await cloudinary.uploader.upload(file, {
        upload_preset: "product_image",
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        overwrite: true,
      });

      // Crear una nueva imagen asociada al producto
      const newImage = await this.prisma.productImage.create({
        data: {
          path: result.secure_url,
          product: {
            connect: { id: productIdInt },
          },
        },
      });

      // Actualizar la propiedad 'images' del producto con la nueva imagen
      const updatedProduct = await this.prisma.product.update({
        where: { id: productIdInt },
        data: {
          images: {
            connect: { id: newImage.id },
          },
        },
      });

      return "success";
    } catch (e) {
      console.log(e);
    }
  }
}
