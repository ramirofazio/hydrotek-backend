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

  @Post("google2")
  google2(@Body() body: {code: string}) {
    return this.authService.google2(body.code);
  }

  @Post("googleSignIn")
  googleSignIn(@Body() body: googleSignInDTO) {
    return this.authService.googleSignIn(body);
  }
}
