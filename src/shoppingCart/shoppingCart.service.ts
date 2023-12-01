import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { NewOrderDTO, UpdateCartDTO } from "./shoppingCartDTO";
import { PrismaService } from "src/prisma/prisma.service";
import { Response } from "../commonDTO";
import { randomUUID } from "crypto";

@Injectable()
export class ShoppingCartService {
  constructor(private prisma: PrismaService) {}

  async createNewOrder({ id, items, totalPrice }: NewOrderDTO): Promise<any> {
    try {
      //todo: No entiendo bien las relaciones, hay que enlazar la orden con los orderProducts y el usuario tambien. luego enviar mail a cliente y a admin
      // todo: Problemas con el orderId que se repetia ¿¿??
      //   const user = await this.prisma.user.findUnique({
      //     where: { id: id },
      //   });

      //   if (!user) {
      //     return HttpStatus.NOT_FOUND;
      //   }

      //   const newOrder = await this.prisma.order.create({
      //     data: {
      //       userId: id,
      //       totalPrice: totalPrice,
      //       products: {
      //         create: items.map((item) => ({
      //           productId: item.productId,
      //           quantity: item.quantity,
      //           price: item.price,
      //           name: item.name,
      //         })),
      //       },
      //     },
      //   });

      //   return newOrder;

      return HttpStatus.CREATED;
    } catch (error) {
      console.error("Error al crear la orden:", error);
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async loadCart(data: UpdateCartDTO): Promise<Response> {
    try {
      const { userId, shoppingCart } = data;
      if (!shoppingCart?.products.length) {
        throw new HttpException(
          "No se encontraron productos que cargar",
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
      return { res: "Se actualizó el carrito de compras", payload: newCart };
    } catch (e) {
      console.log(e);
      throw new HttpException(e.message, HttpStatus.CONFLICT);
    }
  }

  async createMock(): Promise<Response> {
    const mockProduct = {
      id: 1,
      name: "peluch2.0",
      usdPrice: 42.2,
      arsPrice: 42.2 * 960,
      published: true,
      type: 1,
      profile: 2,
      updated: "no actualizado",
    };
    const mock = await this.prisma.product.create({ data: mockProduct });
    return {
      res: "Se creó el producto simulado",
      payload: mock,
    };
  }

  async findById(userId: string): Promise<Response> {
    const cart = await this.prisma.shoppingCart.findUnique({
      where: {
        userId,
      },
      include: {
        products: true,
      },
    });

    return {
      res: `Se encontró el carrito con el ID de usuario ${userId}`,
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
        `El carrito de ${userId} no tiene productos asociados`,
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

    return `Se limpió el carrito de ${userId}`;
  }
}
