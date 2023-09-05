import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { user as userModel } from "@prisma/client";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() data: userModel) {
    const user = await this.userService.createUser(data);
    return user;
  }
}
