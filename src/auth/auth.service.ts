import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import {
  signInDto,
  googleSignInDTO,
  confirmPasswordResetRequest,
  activeUserDTO,
} from "./auth.dto";
import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";
import {
  CreateUserDTO,
  TrueUserDTO,
  TrueUserTransformer,
} from "src/user/user.dto";
import { PrismaService } from "../prisma/prisma.service";
import { OAuth2Client } from "google-auth-library";
import { env } from "process";
import axios from "axios";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class AuthService {
  /* eslint-disable */
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailService: MailService
  ) {}
  /* eslint-enable */

  async signUp(body: CreateUserDTO): Promise<HttpStatus> {
    const isAlready = await this.userService.findByEmail(body.email);
    if (isAlready) {
      throw new HttpException("El email ya esta en uso", HttpStatus.CONFLICT);
    }

    const data: CreateUserDTO = {
      name: body.name,
      tFacturaId: null,
      dni: body.dni,
      email: body.email,
      password: body.password,
      id: randomUUID(),
      active: false,
      roleId: 1,
      profile: {
        id: null,
        avatar: null,
        address: null,
        cellPhone: null,
      },
    };

    await this.userService.createUser(data); //? Se crea pero no autologuea en signUp

    await this.validateSignUp(data.email); //? Se manda mail de confirmacion

    return HttpStatus.CREATED;

    //! Comentado para validar signUp con mail
    // const newUser = await this.userService.createUser(data);

    // const { id, name, role } = newUser;

    // const payload = { sub: id, name: name, role: role.type };

    // const accessToken = await this.jwtService.signAsync(payload);
    // const fullUser = new TrueUserTransformer(newUser, accessToken);

    // return fullUser;
  }

  async signIn({ email, pass }: signInDto): Promise<TrueUserDTO> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException(
        "No se encontro una cuenta asociada al email",
        HttpStatus.NOT_FOUND
      );
    }
    const userIsActive = await this.userService.checkActiveUser(email); //? Chequea si el usuario esta activo
    if (!userIsActive) {
      throw new HttpException(
        "El usuario no esta activado",
        HttpStatus.UNAUTHORIZED
      );
    }

    const { password, id, name, role } = user;

    const match = await bcrypt.compare(pass, password);

    if (!match) {
      throw new HttpException("Contraseña invalida", HttpStatus.UNAUTHORIZED);
    }

    const payload = { sub: id, name: name, role: role.type };

    const accessToken = await this.jwtService.signAsync(payload);
    const fullUser = new TrueUserTransformer(user, accessToken);

    return fullUser;
  }

  async googleAuthCode(code: string): Promise<googleSignInDTO> {
    try {
      const oAuth2Client = new OAuth2Client(
        env.GOOGLE_CLIENT_ID,
        env.GOOGLE_CLIENT_SECRET,
        "http://localhost:5173/session/signIn"
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
    } catch (e) {
      console.log(e);
      throw new HttpException(e.message, HttpStatus.REQUEST_TIMEOUT);
    }
  }

  async googleSignIn({
    email,
    name,
    picture,
  }: googleSignInDTO): Promise<TrueUserDTO> {
    const isAlready = await this.userService.findByEmail(email);
    if (isAlready) {
      const { id, role } = isAlready;

      const payload = { sub: id, isAlready: name, role: role.type };

      const accessToken = await this.jwtService.signAsync(payload);
      const fullUser = new TrueUserTransformer(isAlready, accessToken);

      return fullUser;
    } else {
      const data: CreateUserDTO = {
        name: name,
        email: email,
        active: true,
        roleId: 1,
        password: bcrypt.hashSync(email, 10),
        tFacturaId: null,
        dni: null,
        id: randomUUID(),
        profile: {
          id: null,
          avatar: picture,
          cellPhone: null,
          address: null,
        },
      };
      const user = await this.userService.createUser(data);
      const { id, role } = user;
      const payload = { sub: id, name: user.name, role: role.type };
      const accessToken = await this.jwtService.signAsync(payload);
      const fullUser = new TrueUserTransformer(isAlready, accessToken);
      return fullUser;
    }
  }
  async jwtAutoLogin(accessToken: string): Promise<TrueUserDTO> {
    try {
      const { sub } = await this.jwtService.verifyAsync(accessToken, {
        secret: env.JWT_SECRET_KEY,
      });
      const { email } = await this.prisma.user.findUnique({
        where: { id: sub },
      });
      const userInfo = await this.userService.findByEmail(email);
      const { id, name, role } = userInfo;
      const payload = { sub: id, name: name, role: role.type };

      const newAccessToken = await this.jwtService.signAsync(payload);
      const fullUser = new TrueUserTransformer(userInfo, newAccessToken);

      return fullUser;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.REQUEST_TIMEOUT);
    }
  }

  async initResetPassword(email: string) {
    const existingUser = await this.userService.findByEmail(email);
    const { id, name, role } = existingUser;
    const payload = { sub: id, name: name, role: role.type };
    const newAccessToken = await this.jwtService.signAsync(payload, {
      expiresIn: "1h",
    });

    if (existingUser) {
      this.mailService.sendResetPasswordMail(email, newAccessToken);
    }
  }

  async confirmResetPassword(data: confirmPasswordResetRequest) {
    const verify = await this.jwtService.verify(data.token);
    if (!verify) {
      throw "token invalido";
    }

    return await this.userService.updateForgottenPassword(data);
  }

  async validateSignUp(email: string) {
    const existingUser = await this.userService.findByEmail(email);
    const { id, name, role } = existingUser;
    const payload = { sub: id, name: name, role: role.type };
    const newAccessToken = await this.jwtService.signAsync(payload, {
      expiresIn: "1h",
    });

    if (existingUser && newAccessToken) {
      this.mailService.sendSignUpValidationMail(email, newAccessToken);
    }
  }

  async activeUser(data: activeUserDTO) {
    const verify = await this.jwtService.verify(data.token);
    if (!verify) {
      throw "token invalido";
    }
    return await this.userService.activeUser(data.email);
  }
}
