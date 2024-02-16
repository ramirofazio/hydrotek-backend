import { Body, Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import {
  DeletePromotionalCodeDTO,
  EditPromotionalCodeDTO,
  PromotionalCodeDTO,
} from "./promotional-code.dto";
import { PromotionalCodeService } from "./promotional-code.service";

@Controller("promotionalCode")
export class PromotionalCodeController {
  constructor(private promotionalCodeService: PromotionalCodeService) {}

  @Post()
  async addPromotionalCode(@Body() body: PromotionalCodeDTO) {
    return this.promotionalCodeService.addPromotionalCode(body);
  }

  @Patch()
  async editPromotionalCode(@Body() body: EditPromotionalCodeDTO) {
    return this.promotionalCodeService.editPromotionalCode(body);
  }

  @Delete()
  async deletePromotionalCode(@Body() id: DeletePromotionalCodeDTO) {
    return this.promotionalCodeService.deletePromotionalCode(id);
  }

  @Get()
  async getPromotionalCode() {
    return this.promotionalCodeService.getPromotionalCode();
  }
}
