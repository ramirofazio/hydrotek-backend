import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { signInDto, signUpDto, googleSignInDTO } from "./auth.dto";
@Controller("auth")
export class AuthController {
  /* eslint-disable */
  constructor(private authService: AuthService) {}
  /* eslint-enable */

  @Post("signUp")
  signUp(@Body() body: signUpDto) {
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
}
