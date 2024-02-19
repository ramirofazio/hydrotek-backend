import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {
  EditPromotionalCodeDTO,
  PromotionalCodeDTO,
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
    return await this.prisma.promotionalCode.delete({ where: { id: id } });
  }

  async getPromotionalCode(): Promise<PromotionalCodeDTO[]> {
    return await this.prisma.promotionalCode.findMany({
      select: { id: true, code: true, discount: true },
    });
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
