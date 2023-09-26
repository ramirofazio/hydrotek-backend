import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { signInDto, signUpDto, googleSignInDTO } from "./auth.dto";
import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";
import {
  UserSignInResponseDTO,
  UserSignInResponseDTO2,
} from "src/user/user.dto";
import { PrismaService } from "../prisma/prisma.service";
import { OAuth2Client } from "google-auth-library";
import { env } from "process";
import axios from "axios";


@Injectable()
export class AuthService {
  /* eslint-disable */
  constructor(
    private userServices: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}
  /* eslint-enable */

  async signUp(body: signUpDto): Promise<UserSignInResponseDTO> {
    const newUser = await this.userServices.createUser({
      name: body.name,
      tFacturaId: null,
      dni: body.dni,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
      id: randomUUID(),
      active: true,
      roleId: 1,
      profile: null
    });

    const { id, name, role, email, profile } = newUser;

    const payload = { sub: id, name: name, role: role.type };

    return {
      session: { id: id, email: email, role: role.type },
      profile: profile,
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async signIn({ email, pass }: signInDto): Promise<UserSignInResponseDTO2> {
    const user = await this.userServices.findByEmail(email);
    if (!user) {
      throw new HttpException(
        "No se encontro una cuenta asociada al email",
        HttpStatus.NOT_FOUND
      );
    }
    const { password, id, name, role } = user;
    const match = await bcrypt.compare(pass, password);
    if (!match) {
      throw new HttpException("Contrseña invalida", HttpStatus.UNAUTHORIZED);
    }

    const payload = { sub: id, name: name, role: role.type };

    return {
      session: { id: id, email: user.email, role: role.type },
      profile: user.profile,
      shoppingCart: user.shoppingCart,
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async googleAuthCode(code: string): Promise<googleSignInDTO> {
    const oAuth2Client = new OAuth2Client(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      "http://localhost:5173/user/signIn"
      // ? Para que sea valido el url debe estar autorizado en la google console y coincidir con el "redirect_uri" de la instancia de react-oAuth en el front
    );
    const { tokens } = await oAuth2Client.getToken(code);
    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );
    const { email, name, picture } = userInfo.data;

    return {
      email,
      name,
      picture,
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
        id: randomUUID(),
        email: email,
        name: name,
        password: bcrypt.hashSync(email, 10),
        active: true,
        roleId: 1,
        dni: undefined,
        tFacturaId: null,
        profile: null
      });
      const user = await this.prisma.user.findFirst({
        where: { email: email },
        include: {
          role: { select: { type: true } },
        },
      });

      const { id, role } = user;
      const payload = { sub: id, name: user.name, role: role.type };

      const userProfile = await this.prisma.userProfile.update({
        where: { userId: id },
        data: {
          avatar: picture, // * Cambiar los parametros por el update
        },
      });

      return {
        session: { id: id, email: email, role: role.type },
        profile: userProfile,
        accessToken: await this.jwtService.signAsync(payload),
      };
    }
  }
  async jwtAutoLogin(accessToken: string): Promise<UserSignInResponseDTO2> {
    try {
      console.log("se intento con el JWT: ", accessToken);
      const { sub } = await this.jwtService.verifyAsync(accessToken, {
        secret: env.JWT_SECRET_KEY,
      });
      const { email } = await this.prisma.user.findUnique({
        where: { id: sub },
      });
      const userInfo = await this.userServices.findByEmail(email);
      const { id, name, role } = userInfo;
      const payload = { sub: id, name: name, role: role.type };

      return {
        session: { id: id, email: userInfo.email, role: role.type },
        profile: userInfo.profile,
        shoppingCart: userInfo.shoppingCart,
        accessToken: await this.jwtService.signAsync(payload),
      };

    } catch (e) {
      throw new HttpException(e.message, HttpStatus.REQUEST_TIMEOUT);
    }
  }
}
