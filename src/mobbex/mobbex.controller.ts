import { Body, Controller, Post } from "@nestjs/common";
import { MobbexService } from "./mobbex.service";
import { mobbex } from "mobbex";
import { CheckoutGuestRequest, CheckoutRequest } from "./mobbex.dto";

@Controller("mobbex")
export class MobbexController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly mobbexService: MobbexService) {}

  @Post()
  async generateCheckout(@Body() body: CheckoutRequest) {
    try {
      const mobbexBody = await this.mobbexService.generateBody(
        body.userId,
        body.items,
        body.discount
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const checkout: any = await mobbex.checkout.create(mobbexBody);
      if ("data" in checkout) {
        return checkout.data.url;
      }
      if ("error" in checkout) {
        throw checkout.error;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Post("update-dni")
  async updateUserAndGenerateCheckout(@Body() body: CheckoutRequest) {
    try {
      await this.mobbexService.updateUser(body.userId, body.identifier);
      return await this.generateCheckout(body);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Post("guest")
  async generateGuestCheckout(@Body() body: CheckoutGuestRequest) {
    try {
      const mobbexBody = await this.mobbexService.generateGuestBody(body);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const checkout: any = await mobbex.checkout.create(mobbexBody);
      if ("data" in checkout) {
        return checkout.data.url;
      }
      if ("error" in checkout) {
        throw checkout.error;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
