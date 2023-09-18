import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { UpdateCartDTO } from "./shoppingCartDTO";
import { PrismaService } from "src/prisma/prisma.service";
import { Response } from "../commonDTO";

@Injectable()
export class ShoppingCartService {
  /* eslint-disable */
  constructor(private prisma: PrismaService) {}
  /* eslint-enable */

  async loadCart(data: UpdateCartDTO): Promise<Response> {
    const { userId, shoppingCart } = data;

    if (!shoppingCart.products.length) {
      throw new HttpException(
        "no se encontraron productos que cargar",
        HttpStatus.BAD_REQUEST
      );
    }

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
    const newCart = await this.prisma.shoppingCart.update({
      where: { id: shoppingCartId.id },
      data: {
        totalPrice: shoppingCart.totalPrice,
      },
    });
    return { res: "se actualizo shoppingCart", payload: newCart };
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
