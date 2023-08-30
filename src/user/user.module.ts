import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ProductModule } from 'src/product/product.module';


@Module({
  imports: [ProductModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
