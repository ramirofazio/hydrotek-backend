import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  /* eslint-disable */
  constructor(private prisma: PrismaService) {}
  /* eslint-enable */

  async createUser(data: User): Promise<User> {
    const existingUser = await this.findOne(data.email);
    if (existingUser) {
      throw new HttpException(
        "El correo electrónico ya está en uso",
        HttpStatus.CONFLICT
      );
    }
    return await this.prisma.user.create({ data });
  }

  async findOne(email: string): Promise<User | undefined> {
    return await this.prisma.user.findFirst({
      where: { email: email },
    });
  }
}
