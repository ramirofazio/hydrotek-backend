import { Injectable } from "@nestjs/common";
import {
  DeletePromotionalCodeDTO,
  EditPromotionalCodeDTO,
  PromotionalCodeDTO,
} from "./promotional-code.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PromotionalCodeService {
  constructor(private prisma: PrismaService) {}

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

  async deletePromotionalCode({ id }: DeletePromotionalCodeDTO) {
    return await this.prisma.promotionalCode.delete({ where: { id: id } });
  }

  async getPromotionalCode(): Promise<PromotionalCodeDTO[]> {
    return await this.prisma.promotionalCode.findMany({
      select: { id: true, code: true, discount: true },
    });
  }
}
