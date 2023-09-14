import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User as userModel } from "@prisma/client";

@Controller("user")
export class UserController {
  /* eslint-disable */
  constructor(private readonly userService: UserService) {}
  /* eslint-enable */

  @Get()
  async getAll() {
    return await this.userService.getAll();
  }
  @Get("/:email") // * momentaneo hasta que se termine en el SignIn/SignUp
  async getEmail(@Param("email") email: string) {
    return await this.userService.findByEmail(email);
  }

  @Get("/:id")
  async getById(@Param("id", ParseUUIDPipe) id: string) {
    return await this.userService.getById(id);
  }

  @Post()
  async createUser(@Body() data: userModel) {
    const user = await this.userService.createUser(data);
    return user;
  }
}
