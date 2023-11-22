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
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailModule } from "./mail/mail.module";
import { ProductModule } from "./product/product.module";
import { ApidolarModule } from "./apidolar/apidolar.module";
import { env } from "process";

@Module({
  imports: [
    TestDosModule,
    TestUnoModule,
    UserModule,
    TfacturaModule,
    ProductModule,
    AuthModule,
    PrismaModule,
    CloudinaryModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ShoppingCartModule,
    BlogModule,
    AfipModule,
    MailModule,
    MailerModule.forRoot({
      transport: {
        host: env.MAILTRAP_HOST,
        port: env.MAILTRAP_PORT,
        secure: false,
        auth: {
          user: env.MAILTRAP_USER,
          pass: env.MAILTRAP_PASSWORD,
        },
      },
      defaults: {
        from: env.MAILTRAP_USER,
      },
      template: {
        dir: "./src/templates",
        adapter: new HandlebarsAdapter(), // or any other adapter
        options: {
          strict: true,
        },
      },
    }),
    ApidolarModule,
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
