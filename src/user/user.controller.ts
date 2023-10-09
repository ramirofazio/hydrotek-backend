import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
  Put,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { TfacturaService } from "src/tfactura/tfactura.service";
//lineas comentadas para evitar error eslint
// import {  IdentifierDTO } from "src/afip/afip.dto";
// import { SuccessPostClientDataResponse } from "src/tfactura/tfactura.dto";
import { CreateUserDTO, UpdateUserDTO, updatePasswordDto } from "./user.dto";


@Controller("user")
export class UserController {
  /* eslint-disable */
  constructor(
    private readonly userService: UserService,
    private readonly tfacturaService: TfacturaService
  ) {}
  /* eslint-enable */

  @Get()
  async getAll() {
    return await this.userService.getAll();
  }
  @Get("/:email")
  async getEmail(@Param("email") email: string) {
    return await this.userService.findByEmail(email);
  }

  @Get("/:id")
  async getById(@Param("id", ParseUUIDPipe) id: string) {
    return await this.userService.getById(id);
  }

  @Post()
  async createUser(@Body() data: CreateUserDTO) {
    const existingUser = await this.userService.checkUniques(
      data.email,
      data?.dni
    );
    if (existingUser !== 0) {
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
}
