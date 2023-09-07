import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { User as userModel } from "@prisma/client";

@Controller("user")
export class UserController {
  /* eslint-disable */
  constructor(private readonly userService: UserService) {}
  /* eslint-enable */

  @Post()
  async createUser(@Body() data: userModel) {
    const user = await this.userService.createUser(data);
    return user;
  }
}
