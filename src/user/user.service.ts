import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateUserDTO,
  UserProfileDTO,
  UserSession,
  RawUserDTO,
  SimpleUserDTO,
  updatePasswordDto,
  sessionDTO,
  deliveryInfoDTO,
} from "./user.dto";
import * as bcrypt from "bcrypt";
import { confirmPasswordResetRequest } from "src/auth/auth.dto";
// import { SuccessPostClientDataResponse } from "src/tfactura/tfactura.dto";
import { TfacturaService } from "src/tfactura/tfactura.service";

@Injectable()
export class UserService {
  /* eslint-disable */
  constructor(
    private prisma: PrismaService,
    private readonly tfacturaService: TfacturaService
  ) {}
  /* eslint-enable */

  async markOrderAsPay(fresaId: string): Promise<HttpStatus> {
    try {
      await this.prisma.order.update({
        where: { fresaId: fresaId },
        data: { status: 200 },
      });

      return HttpStatus.OK;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        "error al actualizar la orden",
        HttpStatus.NOT_FOUND
      );
    }
  }

  async getAllOrders() {
    try {
      const orders = await this.prisma.order.findMany({
        select: {
          user: { select: { name: true, email: true } },
          totalPrice: true,
          fresaId: true,
          status: true,
          date: true,
          name: true,
          email: true,
          discount: true,
          products: {
            select: {
              quantity: true,
              price: true,
              name: true,
            },
          },
        },
      });

      if (!orders) {
        throw new HttpException("ordenes no encontradas", HttpStatus.NOT_FOUND);
      }

      return orders;
    } catch (e) {
      console.log(e);
      throw new HttpException("ordenes no encontradas", HttpStatus.NOT_FOUND);
    }
  }

  async getOneOrder(id: string) {
    try {
      const order = await this.prisma.order.findFirst({
        where: { fresaId: id },
        select: {
          totalPrice: true,
          fresaId: true,
          status: true,
          date: true,
          discount: true,
          products: {
            select: {
              quantity: true,
              price: true,
              product: { select: { images: true, name: true } },
            },
          },
        },
      });

      if (!order) {
        throw new HttpException("order no encontrada", HttpStatus.NOT_FOUND);
      }

      return order;
    } catch (e) {
      console.log(e);
      throw new HttpException("order no encontrada", HttpStatus.NOT_FOUND);
    }
  }

  async getOrders(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: id } });

      if (!user) {
        throw new HttpException(
          "usuario no encontrado",
          HttpStatus.BAD_REQUEST
        );
      }

      const userOrders = await this.prisma.order.findMany({
        where: { userId: id },
        select: {
          totalPrice: true,
          fresaId: true,
          status: true,
          date: true,
          discount: true,
          products: {
            select: {
              quantity: true,
              price: true,
              product: { select: { images: true, name: true } },
            },
          },
        },
      });

      if (!userOrders) {
        throw new HttpException("usuario sin ordenes", HttpStatus.NOT_FOUND);
      }

      return userOrders;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        "error al obtener ordenes del usuario",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async alternAdmin(
    id: string,
    currentUser: sessionDTO
  ): Promise<SimpleUserDTO[] | HttpStatus> {
    const userToUpdate = await this.prisma.user.findFirst({ where: { id } });
    const admin = await this.prisma.user.findFirst({
      where: { id: currentUser.id },
    });

    if (!userToUpdate || admin.roleId !== 2) {
      return HttpStatus.BAD_REQUEST;
    }

    const newRoleId = userToUpdate.roleId === 1 ? 2 : 1;

    await this.prisma.user.update({
      where: { id },
      data: { roleId: newRoleId },
    });

    return await this.getAll();
  }

  async getAll(): Promise<SimpleUserDTO[]> {
    return await this.prisma.user.findMany({
      include: {
        _count: { select: { orders: true } },
        role: {
          select: {
            type: true,
          },
        },
      },
      orderBy: { name: "asc" },
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
          active: data.active,
          password: bcrypt.hashSync(data.password, 10),
        },
      });
      await tx.userProfile.create({
        data: {
          user: { connect: { id: user.id } },
          avatar: data.profile.avatar,
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
            address: true,
            avatar: true,
            city: true,
            postalCode: true,
            province: true,
          },
        },
        shoppingCart: {
          include: {
            products: { include: { product: { include: { images: true } } } },
          },
        },
        savedPosts: {
          select: {
            /* post: {
              select: {
                id: true,
                publishDate: true,
                title: true,
                text: true,
                postAssets: true,
              },
            }, */
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
  ): Promise<RawUserDTO> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!existingUser.dni && !existingUser.tFacturaId && user.dni) {
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
      if (existingUser && existingUser.dni === null) {
        const target = await tx.user.update({
          where: { id: id },
          data: {
            name: user.name,
            dni: Number(user.dni),
            tFacturaId: user.tFacturaId,
          },
        });
        await tx.userProfile.update({
          where: { userId: id },
          data: {
            avatar: profile.avatar,
            address: profile.address,
          },
        });
        return target;
      }
      if (existingUser && existingUser.dni !== null) {
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

  async updateForgottenPassword(data: confirmPasswordResetRequest) {
    await this.prisma.user.update({
      where: { email: data.email },
      data: { password: bcrypt.hashSync(data.newPassword, 10) },
    });
    return HttpStatus.OK;
  }

  async checkUniques(email: string, dni: string = null): Promise<boolean> {
    if (dni) {
      const userCount = await this.prisma.user.count({
        where: { OR: [{ email: email }, { dni: Number(dni) }] },
      });
      return userCount > 0;
    } else {
      const userCount = await this.prisma.user.count({
        where: { email: email },
      });
      return userCount > 0;
    }
  }

  async checkDni(dni: string): Promise<number> {
    const userCount = await this.prisma.user.count({
      where: { dni: Number(dni) },
    });
    return userCount;
  }
  //? El userId deberia ser string, porque no lo acepta nest? comentamos para q no joda el eslint
  /* eslint-disable */
  async getSavedPosts(userId: any) {
    const posts = await this.prisma.savedPost.findMany({
      where: { userId: userId.userId },
      include: {
        post: true,
      },
    });
    return posts;
  }
  /* eslint-enable */

  async activeUser(email: string) {
    await this.prisma.user.update({
      where: { email: email },
      data: { active: true },
    });

    return HttpStatus.OK;
  }

  async checkActiveUser(email: string): Promise<boolean> {
    const res = await this.prisma.user.findFirst({
      where: { email: email },
      select: { active: true },
    });

    return res.active;
  }

  async saveDeliveryInfo({
    id,
    address,
    city,
    postalCode,
    province,
  }: deliveryInfoDTO): Promise<any> {
    try {
      const userProfile = await this.prisma.userProfile.update({
        where: { userId: id },
        data: { address, city, postalCode, province },
      });

      return userProfile;
    } catch (e) {
      throw new Error(`error al guardar datos de envio: ${e.message}`);
    }
  }
}
