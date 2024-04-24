import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {
  EditPromotionalCodeDTO,
  PromotionalCodeDTO,
  RelatePromotionalCode,
} from "./promotional-code.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PromotionalCodeService {
  /* eslint-disable */
  constructor(private prisma: PrismaService) {}
  /* eslint-enable */

  async addPromotionalCode({ discount, code }: PromotionalCodeDTO) {
    return await this.prisma.promotionalCode.create({
      data: { discount: discount, code: code },
    });
  }

  async editPromotionalCode({ id, discount, code }: EditPromotionalCodeDTO) {
    return await this.prisma.promotionalCode.update({
      where: { id: id },
      data: { discount: discount, code: code },
    });
  }

  async deletePromotionalCode(id: string) {
    try {
      const promotionalCode = await this.prisma.promotionalCode.findUnique({
        where: { id },
      });
      if (!promotionalCode) {
        throw new HttpException(
          "El codigo promocional no existe",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      const deleted = await this.prisma.promotionalCode.delete({
        where: {
          id,
        },
      });
      console.log(deleted);

      return deleted;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getPromotionalCode(): Promise<PromotionalCodeDTO[]> {
    return await this.prisma.promotionalCode.findMany({
      select: { id: true, code: true, discount: true },
    });
  }

  async relatePromotionalCode({
    promotionalCodeId,
    productId,
  }: RelatePromotionalCode) {
    try {
      const code = await this.prisma.promotionalCode.findFirst({
        where: {
          id: promotionalCodeId,
        },
      });

      if (!code) {
        throw new HttpException(
          "El codigo promocional no existe",
          HttpStatus.NOT_FOUND
        );
      }

      const relation = await this.prisma.promotionalCodeOnProducts.create({
        data: {
          productId,
          promotionalCodeId,
        },
      });
      console.log(relation);
      return relation;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        `Error al relacionar codigo ${e.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async validatePromotionalCode(coupon: string): Promise<PromotionalCodeDTO> {
    const res = await this.prisma.promotionalCode.findFirst({
      where: { code: coupon },
      select: { id: true, code: true, discount: true },
    });

    if (!res) {
      throw new HttpException("Cupon invalido", HttpStatus.BAD_REQUEST);
    }

    return res;
  }
}
