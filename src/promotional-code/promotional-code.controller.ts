import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import {
  EditPromotionalCodeDTO,
  PromotionalCodeDTO,
} from "./promotional-code.dto";
import { PromotionalCodeService } from "./promotional-code.service";

@Controller("promotionalCode")
export class PromotionalCodeController {
  /* eslint-disable */
  constructor(private promotionalCodeService: PromotionalCodeService) {}
  /* eslint-enable */

  @Post()
  async addPromotionalCode(@Body() body: PromotionalCodeDTO) {
    return this.promotionalCodeService.addPromotionalCode(body);
  }

  @Patch()
  async editPromotionalCode(@Body() body: EditPromotionalCodeDTO) {
    return this.promotionalCodeService.editPromotionalCode(body);
  }

  @Delete("/:id")
  async deletePromotionalCode(@Param("id") id: string) {
    return this.promotionalCodeService.deletePromotionalCode(id);
  }

  @Get()
  async getPromotionalCode() {
    return this.promotionalCodeService.getPromotionalCode();
  }

  @Get("/validate/:coupon")
  async validatePromotionalCode(@Param("coupon") coupon: string) {
    return this.promotionalCodeService.validatePromotionalCode(coupon);
  }
}
