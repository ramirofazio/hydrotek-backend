import { Controller, Get, Post } from "@nestjs/common";

import { ApidolarService } from "./apidolar.service";

@Controller("apidolar")
export class ApidolarController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly apidolarService: ApidolarService) {}
  @Post("manual")
  async manualStoreUsdValue() {
    return await this.apidolarService.storeUsdValue();
  }

  @Post("auto")
  async autoStoreUsdValue() {
    return await this.apidolarService.storeUsdValue();
  }

  @Get("last")
  async GetUsdValue() {
    return await this.apidolarService.getSimpleUsdValue();
  }

  @Get("full-last")
  async GetFullUsdValue() {
    return await this.apidolarService.getFullUsdValue();
  }
}
