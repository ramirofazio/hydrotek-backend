import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { signInDto, signUpDto } from "./auth.dto";
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signUp")
  signUp(@Body() body: signUpDto) {
    return this.authService.signUp(body);
  }

  @Post("signIn")
  signIn(@Body() { email, pass }: signInDto) {
    return this.authService.signIn(email, pass);
  }
}
