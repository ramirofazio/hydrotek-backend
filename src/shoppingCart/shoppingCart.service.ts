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
    if (!shoppingCart?.products.length) {
      throw new HttpException(
        "no se encontraron productos que cargar",
        HttpStatus.BAD_REQUEST
      );
    }

    const shoppingCartId = await this.prisma.shoppingCart.findFirst({
      where: { userId },
      include: { products: true },
    });

    const { id } = shoppingCartId;
    if (shoppingCartId.products.length) {
      await this.prisma.productsOnCart.deleteMany({
        where: { shoppingCartId: id },
      });

    }

    const bulkCartProducts = shoppingCart.products.map((p) => {
      return {
        ...p,
        shoppingCartId: id,
      };
    });
    await this.prisma.productsOnCart.createMany({ data: bulkCartProducts });
    const newCart = await this.prisma.shoppingCart.update({
      where: { id: id },
      data: {
        totalPrice: shoppingCart.totalPrice,
      },
    });
    return { res: "se actualizo shoppingCart", payload: newCart };
  }

  async createMock(): Promise<Response> {
    const mockProduct = {
      id: 2,
      name: "pelusa",
      price: 44.2,
      published: true,
      type: 1,
      profile: 2,
      updated: "no updateado",
    };
    const mock = await this.prisma.product.create({ data: mockProduct });
    return {
      res: "se creo el mock product",
      payload: mock,
    };
  }

  async findById(userId: string): Promise<Response> {
    //fin by userId
    const cart = await this.prisma.shoppingCart.findUnique({
      where: {
        userId,
      },
      include: {
        products: true,
      },
    });

    return {
      res: `se encontro el carrito con id de usuario ${userId}`,
      payload: cart,
    };
  }

  async cleanCart(userId: string): Promise<string> {
    const cart = await this.prisma.shoppingCart.findUnique({
      where: { userId },
      include: {
        products: true,
      },
    });
    if (!cart.products.length) {
      throw new HttpException(
        `el carrito de ${userId}, no tiene productos asociados`,
        HttpStatus.CONFLICT
      );
    }
    await this.prisma.productsOnCart.deleteMany({
      where: { shoppingCartId: cart.id },
    });

    await this.prisma.shoppingCart.update({
      where: { userId },
      data: {
        totalPrice: 0,
      },
    });

    return `se limpios el carrito de ${userId}`;
  }
}
