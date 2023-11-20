import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { mobbexBody, mobbexCustomer, mobbexItem, requestItem } from "./mobbex.dto";
import { DateTime } from "luxon";
@Injectable()
export class MobbexService {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly prisma: PrismaService) {}

  async generateBody(userId: string, items: requestItem[]) {
    const customer:mobbexCustomer = await this.generateCustomer(userId);
    const mobbexItems:mobbexItem[] = await this.generateItems(items);
    // const total = this.calculateTotal(mobbexItems);
    const total = 12;
    const reference = this.generateReference(customer);
    const description = `Checkout ${reference}`;
    const currency = "ARS";
    const test = false;
    // eslint-disable-next-line camelcase
    const return_url = "https://mobbex.com/return_url?id=123456";

    const bodyResponse:mobbexBody = {
      total,
      description,
      reference,
      currency,
      test,
      // eslint-disable-next-line camelcase
      return_url,
      customer,
      items : mobbexItems,
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
      phone: user.profile.cellPhone ?? ""
    };
    return response;
  }

  async generateItems(items: requestItem[]) {
    const ids: number[] = items.map(el => el.id);
    const dbProducts = await this.prisma.product.findMany({
      where: {
        id: {
          in: ids
        }
      },
      select: {
        id: true,
        name: true,
        arsPrice: true,
      }
    });
    const mobbexItems:mobbexItem[] = dbProducts.map(el => {
      return {
        description: el.name,
        quantity: items.find(item => item.id === el.id).qty,
        total : el.arsPrice * items.find(item => item.id === el.id).qty,
        image: ""
      };
    });
    return mobbexItems;
  }

  calculateTotal(items:mobbexItem[]) {
    return items.reduce((acc, curr) => {
      return curr.total + acc;
    }, 0);
  }

  generateReference(customer: mobbexCustomer) {
    const timestamp = DateTime.now()
      .setLocale("es")
      .toFormat("dd/MM/yyyy HH:mm");
    return `${customer.name} #${customer.identification} ${timestamp}`;
  }
}
