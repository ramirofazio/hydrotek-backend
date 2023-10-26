import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TestDosModule } from "./test_dos/test_dos.module";
import { TestUnoModule } from "./test_uno/test_uno.module";
import { UserModule } from "./user/user.module";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { RoleService } from "./role/role.service";
import { TfacturaModule } from "./tfactura/tfactura.module";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { ShoppingCartModule } from "./shoppingCart/shoppingCart.module";
import { AfipModule } from "./afip/afip.module";
import { BlogModule } from "./blog/blog.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailModule } from "./mail/mail.module";

@Module({
  imports: [
    TestDosModule,
    TestUnoModule,
    UserModule,
    TfacturaModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ShoppingCartModule,
    BlogModule,
    AfipModule,
    MailModule,
    MailerModule.forRoot({
      transport: {
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "8fa63bb4da955c",
          pass: "a33c43705a940e",
        },
      },
      defaults: {
        from: "8fa63bb4da955c",
      },
      template: {
        dir: "./src/templates",
        adapter: new HandlebarsAdapter(), // or any other adapter
        options: {
          strict: true,
        },
      },
    }),
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    PrismaService,
    RoleService,
  ],
})
export class AppModule {}
