import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TestDosModule } from "./test_dos/test_dos.module";
import { TestUnoModule } from "./test_uno/test_uno.module";
import { UserModule } from "./user/user.module";
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [TestDosModule, TestUnoModule, UserModule, PrismaModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    PrismaService,
  ],
})
export class AppModule {}
