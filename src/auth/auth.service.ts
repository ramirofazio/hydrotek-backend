import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { signInDto, signUpDto } from "./auth.dto";
import { randomUUID } from "crypto";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private userServices: UserService,
    private jwtService: JwtService
  ) {}

  async signUp(body: signUpDto): Promise<User> {
    return await this.userServices.createUser({
      ...body,
      password: bcrypt.hashSync(body.password, 10),
      id: randomUUID(),
      active: true,
      roleId: 1,
    });
  }

  async signIn(
    email: string,
    pass: string
  ): Promise<signInDto | UnauthorizedException | {}> {
    const { password, id, name, roleId } =
      await this.userServices.findOne(email);
    const match = await bcrypt.compare(pass, password);
    if (!match) {
      return new UnauthorizedException();
    }

    const payload = { sub: id, name: name, admin: roleId }; //* A chequear aca el tema del role

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
