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
    const mobbexItems: mobbexItem[] = await this.generateItems(
      items,
      Boolean(discount)
    );

    const total =
      env.env === "production" || env.env === "staging"
        ? this.calculateTotal(mobbexItems)
        : this.calculateTotal(mobbexItems);
    const reference = this.generateReference(customer);
    const description = `Checkout ${reference}`;
    const currency = "ARS";
    // const test = false;
    const test = true;
    // eslint-disable-next-line camelcase
    const return_url = "http://localhost:5173/shoppingCart";
    // const return_url = "https://www.hydrotek.store/shoppingCart";
    const webhook = "http://localhost:3000/mobbex/create-order";

    const bodyResponse: mobbexBody = {
      total,
      description,
      reference,
      currency,
      test,
      webhook: "http://localhost:3000/mobbex/create-order",
      // eslint-disable-next-line camelcase
      return_url,
      customer,
      items: mobbexItems,
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
    const currency = "ARS";
    // const test = false;
    const test = true;
    // eslint-disable-next-line camelcase
    const return_url = "http://localhost:5173/shoppingCart";
    // env.env === "production"
    //   ? "https://www.hydrotek.store/shoppingCart"
    //   : env.env === "staging"
    //     ? "http://85.31.231.196:51732/shoppingCart"
    //     : "http://localhost:5173/shoppingCart";

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
    async function rawArssPrice(
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
    const dbproducts = await rawArssPrice(this.prisma, items, promCode);
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
