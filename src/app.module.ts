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

@Module({
  imports: [TestDosModule, TestUnoModule, UserModule, TfacturaModule, PrismaModule,AuthModule,ConfigModule.forRoot()],

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
