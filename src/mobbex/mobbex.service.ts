import { Injectable } from "@nestjs/common";
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
import { TfacturaService } from "src/tfactura/tfactura.service";
import { SuccessPostClientDataResponse } from "src/tfactura/tfactura.dto";
import { env } from "process";

@Injectable()
export class MobbexService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly prisma: PrismaService,
    // eslint-disable-next-line no-unused-vars
    private readonly tfacturaService: TfacturaService
  ) {}

  async generateBody(userId: string, items: requestItem[], discount: number) {
    const customer: mobbexCustomer = await this.generateCustomer(userId);
    const mobbexItems: mobbexItem[] = await this.generateItems(items);
    const total =
      env.env === "production" || env.env === "staging"
        ? this.calculateTotal(mobbexItems, discount)
        : this.calculateTotal(mobbexItems, discount);
    const reference = this.generateReference(customer);
    const description = `Checkout ${reference}`;
    const currency = "ARS";
    const test = false;
    // eslint-disable-next-line camelcase
    const return_url =
      env.env === "production"
        ? "https://www.hydrotek.store/shoppingCart"
        : env.env === "staging"
          ? "http://85.31.231.196:51732/shoppingCart"
          : "http://localhost:5173/shoppingCart";

    const bodyResponse: mobbexBody = {
      total,
      description,
      reference,
      currency,
      test,
      // eslint-disable-next-line camelcase
      return_url,
      customer,
      items: mobbexItems,
    };
    return bodyResponse;
  }

  async generateGuestBody(body: CheckoutGuestRequest) {
    const customer: mobbexGuestCustomer = await this.generateGuestCustomer({
      ...body,
    });
    const mobbexItems: mobbexItem[] = await this.generateItems(body.items);
    const total =
      env.env === "production" || env.env === "staging"
        ? this.calculateTotal(mobbexItems, body.discount)
        : this.calculateTotal(mobbexItems, body.discount);
    const reference = this.generateGuestReference(customer);
    const description = `Checkout ${reference}`;
    const currency = "ARS";
    const test = false;
    // eslint-disable-next-line camelcase
    const return_url =
      env.env === "production"
        ? "https://www.hydrotek.store/shoppingCart"
        : env.env === "staging"
          ? "http://85.31.231.196:51732/shoppingCart"
          : "http://localhost:5173/shoppingCart";

    const bodyResponse: mobbexBody = {
      total,
      description,
      reference,
      currency,
      test,
      // eslint-disable-next-line camelcase
      return_url,
      customer,
      items: mobbexItems,
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

  async generateItems(items: requestItem[]) {
    const ids: number[] = items.map((el) => el.id);
    const dbProducts = await this.prisma.product.findMany({
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
    const mobbexItems: mobbexItem[] = dbProducts.map((el) => {
      return {
        description: el.name,
        quantity: items.find((item) => item.id === el.id).qty,
        total: el.arsPrice * items.find((item) => item.id === el.id).qty,
        image: "",
      };
    });
    return mobbexItems;
  }

  calculateTotal(items: mobbexItem[], discount: number) {
    const totalItemsPrice = items.reduce((acc, curr) => {
      return curr.total + acc;
    }, 0);

    const totalDiscount = (discount / 100) * totalItemsPrice;

    return totalItemsPrice - totalDiscount;
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

  async updateUser(id: string, identifier: string) {
    // Este bloque solo se puede ejecutar teniendo las credenciales TFactura
    const res: SuccessPostClientDataResponse =
      await this.tfacturaService.createUser(identifier);

    //updateo todo
    await this.prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { id: id },
      });

      if (existingUser) {
        if (typeof res === "object" && "ClienteID" in res) {
          await tx.user.update({
            where: { id: id },
            data: {
              dni: Number(identifier),
              tFacturaId: res.ClienteID,
            },
          });
        } else {
          await tx.user.update({
            where: { id: id },
            data: {
              dni: Number(identifier),
            },
          });
        }
      }
    });
  }
}
