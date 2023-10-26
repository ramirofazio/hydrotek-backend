import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { jwtConstants } from "./constants";
import { PrismaModule } from "src/prisma/prisma.module";
import { MailModule } from "src/mail/mail.module";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      //? Se registra globalmente el JWT para no tener que importar el servicio en todos lados
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "2h" },
    }),
    PrismaModule,
    MailModule
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
