import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { UserResponseDTO } from "./user.dto";

@Injectable()
export class UserService {
  /* eslint-disable */
  constructor(private prisma: PrismaService) {}
  /* eslint-enable */

  async getAll(): Promise<UserResponseDTO[]> {
    return await this.prisma.user.findMany({
      include: {
        role: {
          select: {
            type: true,
          },
        },
      },
    });
  }
  async getById(id: string): Promise<UserResponseDTO> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        role: {
          select: {
            type: true,
          },
        },
      },
    });
    return user;
  }
  async createUser(data: User): Promise<UserResponseDTO> {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new HttpException(
        "El correo electrónico ya está en uso",
        HttpStatus.BAD_REQUEST
      );
    }
    const user = await this.prisma.user.create({ data });
    await this.prisma.userProfile.create({
      data: {
        userId: user.id,
      },
    });
    await this.prisma.shoppingCart.create({
      data: {
        userId: user.id,
        totalPrice: 0
      },
    });
    return await this.findByEmail(user.email);
  }

  async findByEmail(email: string): Promise<UserResponseDTO | undefined> {
    const user = await this.prisma.user.findFirst({
      where: { email: email },
      include: {
        role: {
          select: {
            type: true,
          },
        },
        profile: {
          select: {
            userName: true,
            cellPhone: true,
            adress: true,
            avatar: true,
          },
        },
      },
    });
    return user;
  }
}
