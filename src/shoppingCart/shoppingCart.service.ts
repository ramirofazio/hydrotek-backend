import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { NewOrderDTO, UpdateCartDTO } from "./shoppingCartDTO";
import { PrismaService } from "src/prisma/prisma.service";
import { Response } from "../commonDTO";

@Injectable()
export class ShoppingCartService {
  // eslint-disable-next-line no-unused-vars
  constructor(private prisma: PrismaService) {}

  async createNewOrder({
    id,
    name,
    email,
    items,
    fresaId,
    status,
    totalPrice,
    discount,
  }: NewOrderDTO): Promise<HttpStatus> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({ where: { id: id } });

        if (!user) {
          //? Creo ordenes sin usuarios para los NO LOGGED
          await tx.order.create({
            data: {
              name: name,
              email: email,
              totalPrice: totalPrice,
              fresaId: fresaId,
              status: status,
              discount: discount,
              products: { createMany: { data: items } },
            },
          });

          return HttpStatus.CREATED;
        }

        const newOrder = await tx.order.create({
          data: {
            totalPrice: totalPrice,
            fresaId: fresaId,
            status: status,
            discount: discount,
            user: { connect: { id: user.id } },
            products: { createMany: { data: items } },
          },
        });

        if (!newOrder) {
          return HttpStatus.BAD_REQUEST;
        }

        return HttpStatus.CREATED;
      });
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

      console.log("*******", bulkCartProducts);

      //TODO TOMI ACA ESTA LLEGANOD UNA PROP DE LOS CUPONES QUE PRISMA NO RECONOCE
      //TODO CUANDO EL CARRITO NO TIENE CUPONES ANDA BIEN, EL TEMA ES CUANDO TIENE
      /*
!LLEGA ESTO:

[
  {
    quantity: 1,
    productId: 4068731,
    price: 2662,
    name: 'PLUG COMBO X1U',
    img: 'https://res.cloudinary.com/djdtbqhxm/image/upload/v1693325847/HYD/logos/blackLogo.png',
  !  discountPrice: 266.2,
    shoppingCartId: 1
  },
  {
    quantity: 1,
    productId: 4068732,
    price: 4784,
    name: 'PLUG COMBO X 2U',    img: 'https://res.cloudinary.com/djdtbqhxm/image/upload/v1693325847/HYD/logos/blackLogo.png',
  !  discountPrice: 478.40000000000003,
    shoppingCartId: 1
  },
  {
    quantity: 1,
    productId: 4068736,
    price: 4160,
    name: 'CANASTA INYECTADA N15 NEGRA',
    img: 'https://res.cloudinary.com/djdtbqhxm/image/upload/v1693325847/HYD/logos/blackLogo.png',
    shoppingCartId: 1
  }
]

 */
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
