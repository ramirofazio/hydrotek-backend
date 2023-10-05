import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateUserDTO,
  UserProfileDTO,
  UserSession,
  RawUserDTO,
  SimpleUserDTO,
} from "./user.dto";
import * as bcrypt from "bcrypt";
@Injectable()
export class UserService {
  /* eslint-disable */
  constructor(private prisma: PrismaService) {}
  /* eslint-enable */

  async getAll(): Promise<SimpleUserDTO[]> {
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
  async getById(id: string): Promise<RawUserDTO> {
    const user = await this.prisma.user.findFirst({
      where: { id: id },
      include: {
        role: {
          select: {
            type: true,
          },
        },
        profile: {
          select: {
            cellPhone: true,
            address: true,
            avatar: true,
          },
        },
        shoppingCart: {
          include: { products: true },
        },
        savedPosts: {
          select: {
            post: {
              select: {
                id: true,
                publishDate: true,
                title: true,
                text: true,
                postAssets: true,
              },
            },
            postId: true,
          },
        },
      },
    });

    return user;
  }
  async createUser(data: CreateUserDTO): Promise<RawUserDTO> {
    const user = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          dni: Number(data.dni),
          tFacturaId: data.tFacturaId,
          email: data.email,
          roleId: data.roleId,
          password: bcrypt.hashSync(data.password, 10),
        },
      });
      await tx.userProfile.create({
        data: {
          user: { connect: { id: user.id } },
          avatar: data.profile.avatar,
          cellPhone: data.profile.cellPhone,
          address: data.profile.address,
        },
      });
      await tx.shoppingCart.create({
        data: {
          userId: user.id,
          totalPrice: 0,
        },
      });
      return user;
    });
    return await this.findByEmail(user.email);
    // const fullUser = await this.findByEmail(user.email);
    // return new TrueUserTransformer(fullUser);
  }

  async findByEmail(email: string): Promise<RawUserDTO | undefined> {
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
            cellPhone: true,
            address: true,
            avatar: true,
          },
        },
        shoppingCart: {
          include: { products: true },
        },
        savedPosts: {
          select: {
            post: {
              select: {
                id: true,
                publishDate: true,
                title: true,
                text: true,
                postAssets: true,
              },
            },
            postId: true,
          },
        },
      },
    });

    return user;
  }

  async updateUser(
    id: string,
    user: UserSession,
    profile: UserProfileDTO
  ): Promise<any> {
    await this.prisma.$transaction(async (tx) => {
      const target = await tx.user.update({
        where: { id: id },
        data: {
          name: user.name,
          email: user.email,
        },
      });
      await tx.userProfile.update({
        where: { userId: id },
        data: {
          avatar: profile.avatar,
          address: profile.address,
          cellPhone: profile.cellPhone,
        },
      });
      return target;
    });

    return await this.findByEmail(user.email);
  }

  async checkUniques(email: string, dni: string = null): Promise<number> {
    if (dni) {
      const userCount = await this.prisma.user.count({
        where: { OR: [{ email: email }, { dni: Number(dni) }] },
      });
      return userCount;
    } else {
      const userCount = await this.prisma.user.count({
        where: { email: email },
      });
      return userCount;
    }
  }

  async checkDni(dni: string): Promise<number> {
    const userCount = await this.prisma.user.count({
      where: { dni: Number(dni) },
    });
    return userCount;
  }
}
