import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDTO, UserProfileDTO, UserResponseDTO, UserSession } from "./user.dto";
import * as bcrypt from "bcrypt";
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
  async createUser(data: CreateUserDTO): Promise<UserResponseDTO> {
    const user = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          dni: Number(data.dni),
          tFacturaId: data.tFacturaId,
          email: data.email,
          roleId: data.roleId,
          password: bcrypt.hashSync(data.password, 10)
        }
      });
      await tx.userProfile.create({
        data: {
          userId: user.id,
          avatar: data.profile.avatar,
          address: data.profile.address,
          cellPhone: data.profile.cellPhone
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
                id:true,
                publishDate:true,
                title:true,
                text:true,
                postAssets:true
              }
            },
            postId: true,
          },
        },
      },
    });

    return user;
  }

  async updateUser(id:string, user:UserSession, profile:UserProfileDTO) : Promise<any> {

    const transaction = await this.prisma.$transaction(async (tx) => {
      const target = await tx.user.update({
        where: { id : id },
        data: {
          name: user.name,
          email: user.email,
        }
      });
      await tx.userProfile.update({
        where: { userId : id },
        data: {

          avatar: profile.avatar,
          address: profile.address,
          cellPhone: profile.cellPhone
        },
      });
      return target;
    });

    return transaction;
  }

  async checkUniques(email:string, dni:string = null) : Promise<number> {
    if(dni) {
      const userCount = await this.prisma.user.count({
        where:

        { OR: [
          { email: email },
          { dni: Number(dni) }
        ] },
      });
      return userCount;
    }
    else {
      const userCount = await this.prisma.user.count({
        where: { email: email },
      });
      return userCount;
    }

  }

  async checkDni(dni:string) : Promise<number> {
    const userCount = await this.prisma.user.count({
      where: { dni: Number(dni) },
    });
    return userCount;
  }
}
