import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CategoryService {
  /* eslint-disable */
  constructor(private prisma: PrismaService) {}
  /* eslint-enable */

  async createCategories() {
    const categories = [
      { id: 1, name: "sistemas" },
      { id: 2, name: "insumos" },
      { id: 3, name: "fertilizantes" },
      { id: 4, name: "aditivos" },
    ];

    const res = categories.map(async (c) => {
      await this.prisma.productType.upsert({
        where: {
          id: c.id,
        },
        update: { type: c.name },
        create: {
          id: c.id,
          type: c.name
        },
      });
    });

    return res;
  }
}
