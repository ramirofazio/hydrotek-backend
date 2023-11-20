import { Body, Controller, Post } from "@nestjs/common";
import { MobbexService } from "./mobbex.service";
import { mobbex } from "mobbex";
import { CheckoutRequest, failureCheckoutResponse, successCheckoutResponse } from "./mobbex.dto";


@Controller("mobbex")
export class MobbexController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly mobbexService: MobbexService) {}

  @Post()
  async generateCheckout(@Body() body: CheckoutRequest) {
    try {
      const mobbexBody = await this.mobbexService.generateBody(body.userId, body.items);
      // return mobbexBody;
      const checkout: successCheckoutResponse | failureCheckoutResponse = await mobbex.checkout.create(mobbexBody);
      if("data" in checkout) {
        return checkout.data.url;
      }
      if("error" in checkout) {
        throw checkout.error;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
