import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Put,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  signInDto,
  googleSignInDTO,
  confirmPasswordResetRequest,
  initPasswordResetRequest,
  activeUserDTO,
} from "./auth.dto";
import { CreateUserDTO } from "src/user/user.dto";
@Controller("auth")
export class AuthController {
  /* eslint-disable */
  constructor(private authService: AuthService) {}
  /* eslint-enable */

  @Post("signUp")
  signUp(@Body() body: CreateUserDTO) {
    return this.authService.signUp(body);
  }

  @Post("signIn")
  signIn(@Body() body: signInDto) {
    return this.authService.signIn(body);
  }

  @Post("googleAuthCode")
  async googleAuthCode(@Body() body: { code: string }) {
    const userInfo = await this.authService.googleAuthCode(body.code);
    return this.authService.googleSignIn(userInfo);
  }

  @Post("googleImplicit")
  googleSignIn(@Body() body: googleSignInDTO) {
    return this.authService.googleSignIn(body);
  }

  @Post("jwtAutoLogin")
  jwtAutoLogin(@Body() body: { accessToken: string }) {
    return this.authService.jwtAutoLogin(body.accessToken);
  }

  @Post("init-reset")
  async initResetPassword(@Body() body: initPasswordResetRequest) {
    try {
      return this.authService.initResetPassword(body.email);
    } catch (error) {
      return error;
    }
  }

  @Post("reset-password")
  async resetPassword(@Body() body: confirmPasswordResetRequest) {
    try {
      return await this.authService.confirmResetPassword(body);
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        throw new HttpException("token invalido", HttpStatus.UNAUTHORIZED);
      } else {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Put("active-user")
  async activeUser(@Body() body: activeUserDTO) {
    try {
      return await this.authService.activeUser(body);
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        throw new HttpException("token invalido", HttpStatus.UNAUTHORIZED);
      } else {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
