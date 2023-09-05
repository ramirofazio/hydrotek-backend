import { Injectable } from "@nestjs/common";
import { user as userModel, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: userModel): Promise<userModel> {
    const user = await this.prisma.user.create({ data });
    return user;
  }
}
