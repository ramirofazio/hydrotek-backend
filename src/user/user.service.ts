import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateUserDTO,
  UserProfileDTO,
  UserSession,
  RawUserDTO,
  SimpleUserDTO,
  updatePasswordDto,
} from "./user.dto";
import * as bcrypt from "bcrypt";
// import { SuccessPostClientDataResponse } from "src/tfactura/tfactura.dto";
import { TfacturaService } from "src/tfactura/tfactura.service";
@Injectable()
export class UserService {
  /* eslint-disable */
  constructor(private prisma: PrismaService,private readonly tfacturaService: TfacturaService) {}
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
        postComments: true,
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
          dni: data.dni ? Number(data.dni) : null,
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
    console.log("arranca");

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
    console.log("USER", user);

    return user;
  }

  async updateUser(
    id: string,
    user: UserSession,
    profile: UserProfileDTO
  ): Promise<RawUserDTO> {

    const existingUser = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if((!existingUser.dni && !existingUser.tFacturaId) && user.dni) {
      // Este bloque solo se puede ejecutar teniendo las credenciales TFactura

      // const res:SuccessPostClientDataResponse = await this.tfacturaService.createUser(user.dni);


      // if(typeof res === "object" && "ClienteID" in res) {
      //   user.tFacturaId = res.ClienteID;
      // }
    }
    await this.prisma.$transaction(async (tx) => {

      const existingUser = await tx.user.findUnique({
        where: { id: id },
      });
      if(existingUser && existingUser.dni === null) {
        const target = await tx.user.update({
          where: { id: id },
          data: {
            name: user.name,
            dni : Number(user.dni),
            tFacturaId : user.tFacturaId
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
      }
      if(existingUser && existingUser.dni !== null) {
        const target = await tx.user.update({
          where: { id: id },
          data: {
            name: user.name,
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
      }


    });


    return await this.findByEmail(user.email);
  }

  async updatePassword({
    id,
    actualPassword,
    newPassword,
    newConfirmPassword,
  }: updatePasswordDto): Promise<HttpException | HttpStatus> {
    const user = await this.getById(id);

    const match = await bcrypt.compare(actualPassword, user.password);

    if (!match) {
      throw new HttpException(
        "Contraseña actual invalida",
        HttpStatus.UNAUTHORIZED
      );
    }

    if (newPassword === newConfirmPassword) {
      await this.prisma.user.update({
        where: { id: id },
        data: { password: bcrypt.hashSync(newPassword, 10) },
      });
    }

    return HttpStatus.OK;
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
