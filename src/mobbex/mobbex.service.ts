import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CheckoutGuestRequest,
  mobbexBody,
  mobbexCustomer,
  mobbexGuestCustomer,
  mobbexItem,
  requestItem,
} from "./mobbex.dto";
import { DateTime } from "luxon";
import { env } from "process";
import { UserService } from "src/user/user.service";
import { ShoppingCartService } from "src/shoppingCart/shoppingCart.service";

@Injectable()
export class MobbexService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly prisma: PrismaService,
    // eslint-disable-next-line no-unused-vars
    private readonly userService: UserService,
    // eslint-disable-next-line no-unused-vars
    private readonly cartService: ShoppingCartService
    //! DEPRECADO
    //private readonly tfacturaService: TfacturaService
  ) {}

  async webhookResponse(data) {
    try {
      console.log("WEBHOOK DATA RAW", data);

      const status =
        data?.status?.code || data?.payment?.status?.code || data.status.code;

      if (status !== "200") {
        console.log("PAGO FALLIDO");
        //! EN ESTE BLOQUE A FUTURO SE PUEDEN HACER COSITAS DE EMAIL MARKETING U OTROS FLUJOS CUANDO EL PAGO FALLO

        const orderId =
          data?.payment?.reference ||
          data?.checkout?.reference ||
          data.reference;

        //? Elimino la orden temporal creada porque fallo el pago
        await this.prisma.order.delete({
          where: { id: orderId, type: "TEMPORAL" },
        });

        //? Elimino los items de la orden temporal porque fallo el pago
        await this.prisma.orderProducts.deleteMany({
          where: { orderId },
        });

        console.log("BORRE ORDEN TEMPORAL E ITEMS");

        throw new HttpException(
          JSON.stringify(data.payment.status),
          HttpStatus.BAD_REQUEST
        );
      }

      const orderId = data.payment.reference;
      const userId = data.customer.identification;
      const transactionId = data.payment.id;
      const type = data.payment.source.type;

      console.log("WEBHOOK DATA:", userId, transactionId, type, orderId);

      await this.prisma.order.update({
        where: { id: orderId, type: "TEMPORAL" },
        data: { type, fresaId: transactionId },
      });

      //! DE ACA MANDO EL MAIL DE CONFIRMACION DE COMPRA PARA HYDRO Y USERS
      //await this.mail.sendConfirmOrderEmail(newOrder, email, fantasyName);
      console.log("TODO ACTUALIZADO");
      return HttpStatus.OK;
    } catch (e) {
      console.log("Hubo un fallo en el webhook---:", e);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async generateBody(userId: string, items: requestItem[], discount: number) {
    const { email, name } = await this.userService.getById(userId);

    const customer: mobbexCustomer = await this.generateCustomer(userId);

    const mobbexItems: mobbexItem[] = await this.generateItems(
      items,
      Boolean(discount)
    );

    const total = this.calculateTotal(mobbexItems);

    const orderItems = await Promise.all(
      items.map(async ({ id, qty }) => {
        const { name, arsPrice } = await this.prisma.product.findFirst({
          where: { id },
          select: { name: true, arsPrice: true },
        });

        return { name, productId: id, quantity: qty, price: arsPrice };
      })
    );

    //? Creo una orden temporal para confirmar una vez hecho el pago. (EN WEBHOOK)
    const orderId = await this.cartService.createNewOrder({
      id: userId,
      name,
      email,
      items: orderItems,
      discount,
      totalPrice: total,
      fresaId: "00000", //? ESTO SE CAMBIA EN WEBHOOK
      type: "TEMPORAL", //? ESTO SE CAMBIA EN WEBHOOK
    });

    console.log("ORDERID + ", orderId);

    const bodyResponse: mobbexBody = {
      webhook: env.MOBBEX_X_WEBHOOK, //! AGREGAR ESTO A ENV
      webhooksType: "all",
      total,
      description: `Venta WEB para ${name}`,
      reference: orderId,
      test: env.env === "production" ? false : true,
      // eslint-disable-next-line camelcase
      return_url: env.MOBBEX_X_RETURN_URL, //! AGREGAR ESTO A ENV
      customer,
      items: mobbexItems,
      currency: "ARS",
      sources: [
        "naranja",
        "mastercard",
        "mastercard.debit",
        "maestro",
        "visa.debit",
        "visa",
        "cabal",
        "cabal.debit",
        "visa.prepaid",
        "mastercard.prepaid",
      ],
    };
    return bodyResponse;
  }

  async generateGuestBody(body: CheckoutGuestRequest) {
    const customer: mobbexGuestCustomer = await this.generateGuestCustomer({
      ...body,
    });
    const mobbexItems: mobbexItem[] = await this.generateItems(
      body.items,
      Boolean(body.discount)
    );
    const total =
      env.env === "production" || env.env === "staging"
        ? this.calculateTotal(mobbexItems)
        : this.calculateTotal(mobbexItems);

    const reference = this.generateGuestReference(customer);
    const description = `Checkout ${reference}`;
    const test = env.env === "production" ? false : true;
    // eslint-disable-next-line camelcase
    const return_url =
      env.env === "production"
        ? "https://www.hydrotek.store/shoppingCart"
        : env.env === "staging"
          ? "http://85.31.231.196:51732/shoppingCart"
          : "http://localhost:5173/shoppingCart";

    const bodyResponse: mobbexBody = {
      webhook: "https://rfddevelopment.tech/mobbex/webhook",
      webhooksType: "all",
      total,
      description,
      reference,
      test,
      // eslint-disable-next-line camelcase
      return_url,
      customer,
      items: mobbexItems,
      currency: "ARS",
      sources: [
        "naranja",
        "mastercard",
        "mastercard.debit",
        "maestro",
        "visa.debit",
        "visa",
        "cabal",
        "cabal.debit",
        "visa.prepaid",
        "mastercard.prepaid",
      ],
    };
    return bodyResponse;
  }

  async generateCustomer(userId: string) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    const response: mobbexCustomer = {
      email: user.email,
      name: user.name,
      identification: user.dni.toString(),
      uid: user.id,
    };
    return response;
  }

  async generateGuestCustomer(body: CheckoutGuestRequest) {
    const response: mobbexGuestCustomer = {
      email: body.email,
      name: `${body.firstName} ${body.lastName}`,
      identification: body.dni ?? "",
    };
    return response;
  }

  async generateItems(items: requestItem[], promCode: boolean) {
    async function rawArsPrice(
      prisma,
      items: requestItem[],
      promCode: boolean
    ) {
      const ids: number[] = items.map((el) => el.id);
      const dbproducts = await prisma.product.findMany({
        where: {
          id: {
            in: ids,
          },
        },
        select: {
          id: true,
          name: true,
          arsPrice: true,
        },
      });

      if (promCode) {
        const rawProdructs = dbproducts.map((p) => {
          const product = items.find((item) => item.id === p.id);
          if (product.discountPrice) {
            return {
              ...p,
              arsPrice: product.discountPrice,
            };
          } else {
            return p;
          }
        });
        return rawProdructs;
      } else {
        return dbproducts;
      }
    }
    const dbproducts = await rawArsPrice(this.prisma, items, promCode);
    const mobbexItems: mobbexItem[] = dbproducts.map((el) => {
      return {
        description: el.name,
        quantity: items.find((item) => item.id === el.id).qty,
        total: el.arsPrice * items.find((item) => item.id === el.id).qty,
        image: "",
      };
    });
    return mobbexItems;
  }

  calculateTotal(items: mobbexItem[]) {
    const totalItemsPrice = items.reduce((acc, curr) => {
      return curr.total + acc;
    }, 0);
    return totalItemsPrice;
  }

  generateReference(customer: mobbexCustomer) {
    const timestamp = DateTime.now()
      .setLocale("es")
      .toFormat("dd/MM/yyyy HH:mm");
    return `${customer.name} #${customer.identification} ${timestamp}`;
  }

  generateGuestReference(customer: mobbexGuestCustomer) {
    const timestamp = DateTime.now()
      .setLocale("es")
      .toFormat("dd/MM/yyyy HH:mm");
    if (customer.identification.length > 0) {
      return `${customer.name} #${customer.identification} ${timestamp}`;
    } else {
      return `${customer.name} ${timestamp}`;
    }
  }

  //! DEPRECADO
  //   async updateUser(id: string, identifier: string) {
  //     // Este bloque solo se puede ejecutar teniendo las credenciales TFactura
  //     const res: SuccessPostClientDataResponse =
  //       await this.tfacturaService.createUser(identifier);

  //     //updateo todo
  //     await this.prisma.$transaction(async (tx) => {
  //       const existingUser = await tx.user.findUnique({
  //         where: { id: id },
  //       });

  //       if (existingUser) {
  //         if (typeof res === "object" && "ClienteID" in res) {
  //           await tx.user.update({
  //             where: { id: id },
  //             data: {
  //               dni: Number(identifier),
  //               tFacturaId: res.ClienteID,
  //             },
  //           });
  //         } else {
  //           await tx.user.update({
  //             where: { id: id },
  //             data: {
  //               dni: Number(identifier),
  //             },
  //           });
  //         }
  //       }
  //     });
  //   }
}
