import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { UpdateCartDTO } from "./product.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Response } from "../commonDTO";
import { TfacturaService } from "src/tfactura/tfactura.service";

@Injectable()
export class ProductService {
  /* eslint-disable */
  constructor(
    private prisma: PrismaService,
    private tfacturaService: TfacturaService
  ) {}
  /* eslint-enable */

  async updateDBProducts(): Promise<any> {
    const res = await this.tfacturaService.getToken();
    console.log(res);
    if (res !== "success") {
      throw new HttpException("cannot get token", HttpStatus.FAILED_DEPENDENCY);
    }
  }

  /* async createMock(): Promise<Response> {
    const mockProduct = {
      id: 1,
      name: "peluch2.0",
      price: 42.2,
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
  } */
}
