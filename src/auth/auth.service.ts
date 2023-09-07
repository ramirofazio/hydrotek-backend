import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { signInDto, signUpDto } from "./auth.dto";
import { randomUUID } from "crypto";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  /* eslint-disable */
  constructor(
    private userServices: UserService,
    private jwtService: JwtService
  ) {}
  /* eslint-enable */

  async signUp(body: signUpDto): Promise<User> {
    return await this.userServices.createUser({
      ...body,
      password: bcrypt.hashSync(body.password, 10),
      id: randomUUID(),
      active: true,
      roleId: 1,
    });
  }

  async signIn({ email, pass }: signInDto): Promise<{ accessToken: string }> {
    const user = await this.userServices.findOne(email);
    if (!user) {
      throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);
    }
    const { password, id, name, roleId } = user;
    const match = await bcrypt.compare(pass, password);
    if (!match) {
      throw new UnauthorizedException();
    }

    const payload = { sub: id, name: name, admin: roleId }; //* A chequear aca el tema del role

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
