import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CategoryService {
  /* eslint-disable */
  constructor(private prisma: PrismaService) {}
  /* eslint-enable */

  async createCategories() {
    const categories = ["sistemas", "insumos", "fertilizantes", "aditivos"];
    const res = categories.map(async (c) => {
      const exist = await this.prisma.productType.findFirst({
        where: { type: c },
      });
      if (!exist) {
        await this.prisma.productType.create({
          data: {
            type: c,
          },
        });
      }
    });

    return res;
  }
}
