import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { signInDto, signUpDto, googleSignInDTO } from "./auth.dto";
import { randomUUID } from "crypto";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { UserSignInResponseDTO } from "src/user/user.dto";
import { PrismaService } from "../prisma/prisma.service";
@Injectable()
export class AuthService {
  /* eslint-disable */
  constructor(
    private userServices: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService
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

  async googleSignIn({
    email,
    name,
    picture,
  }: googleSignInDTO): Promise<UserSignInResponseDTO> {
    const isAlready = await this.userServices.findByEmail(email);
    if (isAlready) {
      const { id, role } = isAlready;
      const payload = { sub: id, name: isAlready.name, role: role.type };

      return {
        session: { id: id, email: isAlready.email, role: role.type },
        profile: isAlready.profile,
        accessToken: await this.jwtService.signAsync(payload),
      };
    } else {
      await this.userServices.createUser({
        email: email,
        name: name,
        password: bcrypt.hashSync(email, 10),
        active: true,
        roleId: 1,
        id: `cacatua ${email}`,
        dni: 0,
      });

      const user = await this.prisma.user.findFirst({
        where: { email: email },
        include: {
          role: { select: { type: true } },
        },
      });

      const { id, role } = user;
      const userProfile = await this.prisma.userProfile.create({
        data: {
          userId: id,
          avatar: picture, // * Cambiar los parametros por el update
        },
      });
      const payload = { sub: id, name: user.name, role: role.type };

      return {
        session: { id: id, email: isAlready.email, role: role.type },
        profile: userProfile,
        accessToken: await this.jwtService.signAsync(payload),
      };
    }
  }
}
