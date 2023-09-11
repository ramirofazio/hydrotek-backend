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
import { UserSignInResponseDTO } from "src/user/user.dto";

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

  async signIn({ email, pass }: signInDto): Promise<UserSignInResponseDTO> {
    const user = await this.userServices.findByEmail(email);
    if (!user) {
      throw new HttpException("Usuario no encontrado", HttpStatus.NOT_FOUND);
    }
    const { password, id, name, role } = user;
    const match = await bcrypt.compare(pass, password);
    if (!match) {
      throw new UnauthorizedException();
    }

    const payload = { sub: id, name: name, role: role.type };

    return {
      session: { id: id, email: user.email, role: role.type },
      profile: user.profile,
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
