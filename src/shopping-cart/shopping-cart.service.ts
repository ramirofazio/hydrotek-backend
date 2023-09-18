import { Injectable } from "@nestjs/common";
import { CreateDTO } from "./shoppingCartDTO";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ShoppingCartService {
  constructor(private prisma: PrismaService) {}

  async loadCart(data: CreateDTO): Promise<string> {
    const { userId, shoppingCart } = data;
    const shoppingCartId = await this.prisma.shoppingCart.findFirst({
      where: { userId },
    });
    const bulkCartProducts = shoppingCart.products.map((p) => {
      return {
        ...p,
        shoppingCartId: shoppingCartId.id,
      };
    });
    await this.prisma.productsOnCart.createMany({ data: bulkCartProducts });
    const s = await this.prisma.shoppingCart.findUnique({
      where: { userId: userId },
    });
    //await this.prisma.shoppingCart.create({});
    return "This action adds a new shoppingCart";
  }

  findOne(id: number) {
    return `This action returns a #${id} shoppingCart`;
  }

  update(id: number) {
    return `This action updates a #${id} shoppingCart`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoppingCart`;
  }
}
