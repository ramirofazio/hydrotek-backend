import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Put,
  Patch,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { TfacturaService } from "src/tfactura/tfactura.service";
//lineas comentadas para evitar error eslint
// import {  IdentifierDTO } from "src/afip/afip.dto";
// import { SuccessPostClientDataResponse } from "src/tfactura/tfactura.dto";
import {
  CreateUserDTO,
  UpdateUserDTO,
  sessionDTO,
  updatePasswordDto,
  deliveryInfoDTO,
} from "./user.dto";

@Controller("user")
export class UserController {
  /* eslint-disable */
  constructor(
    private readonly userService: UserService,
    private readonly tfacturaService: TfacturaService
  ) {}
  /* eslint-enable */

  @Patch("mark-order-as-pay")
  async markOrderAsPay(@Query("fresaId") fresaId: string) {
    return this.userService.markOrderAsPay(fresaId);
  }

  @Get("get-all-orders")
  async getAllOrders() {
    return this.userService.getAllOrders();
  }

  @Get("get-one-order")
  async getOneOrder(@Query("id") id: string) {
    return this.userService.getOneOrder(id);
  }

  @Get("orders")
  async getOrders(@Query("id") id: string) {
    return this.userService.getOrders(id);
  }

  @Patch("save-deliveryInfo")
  async saveDeliveryInfo(@Body() body: deliveryInfoDTO) {
    return await this.userService.saveDeliveryInfo(body);
  }

  @Put("alternAdmin")
  async alternAdmin(
    @Body("id") id: string,
    @Body("currenUser") currentUser: sessionDTO
  ) {
    return await this.userService.alternAdmin(id, currentUser);
  }

  @Get()
  async getAll() {
    return await this.userService.getAll();
  }

  @Get("/:email")
  async getEmail(@Param("email") email: string) {
    return await this.userService.findByEmail(email);
  }

  @Get("/id/:id")
  async getById(@Param("id") id: string) {
    return await this.userService.getById(id);
  }

  @Post()
  async createUser(@Body() data: CreateUserDTO) {
    const existingUser = await this.userService.checkUniques(
      data.email,
      data?.dni
    );
    if (existingUser) {
      throw new HttpException("Usuario registrado", HttpStatus.BAD_REQUEST);
    }
    // Este bloque solo se puede ejecutar teniendo las credenciales TFactura
    // if(data.dni) {
    //   const res:SuccessPostClientDataResponse = await this.tfacturaService.createUser(data.dni);
    //   if(typeof res === "object" && "ClienteID" in res) {

    //     data.tFacturaId = res.ClienteID;
    //   }
    // }
    try {
      const user = await this.userService.createUser(data);
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Put()
  async updateUser(@Body() data: UpdateUserDTO) {
    const user = data.session;
    const profile = data.profile;
    const id: string = data.session.id;
    try {
      const update = await this.userService.updateUser(id, user, profile);
      console.log(update);

      return update;
    } catch (error) {
      throw new HttpException(
        `Ocurrió un error, ${error}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Put("/updatePassword")
  async updatePassword(@Body() data: updatePasswordDto) {
    try {
      const update = await this.userService.updatePassword(data);
      return update;
    } catch (error) {
      throw new HttpException(
        `Ocurrió un error, ${error}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  //? El userId deberia ser string, porque no lo acepta nest? comentamos para q no joda el eslint
  /* eslint-disable */
  @Get("/savedPosts/:userId")
  getSavedPosts(@Param() userId: any) {
    return this.userService.getSavedPosts(userId);
  }
  /* eslint-enable */
}
