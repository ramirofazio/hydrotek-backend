import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { v2 as cloudinary } from "cloudinary";
import { env } from "process";
import { DeleteOneProductImgDTO } from "./cloudinary.dto";
@Injectable()
export class CloudinaryService {
  /* eslint-disable */
  constructor(private prisma: PrismaService) {}

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

  async deleteAllProductImg(productId: number) {
    const cloudImgs = await this.prisma.productImage.findMany({
      where: {
        productId,
      },
      select: { publicId: true },
    });
    const cloudIds = cloudImgs?.map((img) => img.publicId);
    const deleted_db = await this.prisma.productImage.deleteMany({
      where: { productId },
    });
    cloudinary.config({
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
    });
    const deleted_cloud = await cloudinary.api.delete_resources(cloudIds, {
      all: true,
    });

    return { deleted_cloud, deleted_db };
  }
  async deleteOneProductImg(body: DeleteOneProductImgDTO) {
    const { productImgId, publicId } = body;
    console.log(productImgId);
    const deleted_db = await this.prisma.productImage.delete({
      where: {
        id: productImgId,
      },
    });
    cloudinary.config({
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
    });
    const deleted_cloud = await cloudinary.api.delete_resources([publicId], {
      all: true,
    });

    return { deleted_cloud, deleted_db };
  }

  // async loadProductImage(body: { file: string; productId: number; publicId: string}) {
  //   try {
  //     const { file, productId, publicId } = body;
  //     console.log(file, productId);

  //     // Convert productId to an integer
  //     //const productIdInt = parseInt(productId, 10);

  //     const result = await cloudinary.uploader.upload(file, {
  //       upload_preset: "product_image",
  //       api_key: env.CLOUDINARY_API_KEY,
  //       api_secret: env.CLOUDINARY_API_SECRET,
  //       cloud_name: env.CLOUDINARY_CLOUD_NAME,
  //       overwrite: true,
  //     });

  //     // Crear una nueva imagen asociada al producto
  //     const newImage = await this.prisma.productImage.create({
  //       data: {
  //         path: result.secure_url,
  //         publicId,
  //         productId,
  //         /* product: {
  //           connect: { id: productIdInt },
  //         }, */
  //       },
  //     });

  //     // Actualizar la propiedad 'images' del producto con la nueva imagen
  //     const updatedProduct = await this.prisma.product.update({
  //       where: { id: productIdInt },
  //       data: {
  //         images: {
  //           connect: { id: newImage.id },
  //         },
  //       },
  //     });

  //     return "success";
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
}
