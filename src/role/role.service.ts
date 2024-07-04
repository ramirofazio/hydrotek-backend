import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class RoleService {
  /* eslint-disable */
  constructor(
    private prisma: PrismaService,
    private user: UserService
  ) {}
  /* eslint-enable */

  async createRolesAndTestUsersIfNotExist() {
    const userRole = await this.prisma.role.findFirst({
      where: { type: "USER" },
    });
    if (!userRole.type) {
      await this.prisma.role.create({ data: { type: "USER" } });
      console.log("### USER ROLE CREATED");
    }

    const adminRole = await this.prisma.role.findFirst({
      where: { type: "ADMIN" },
    });
    if (!adminRole.type) {
      await this.prisma.role.create({ data: { type: "ADMIN" } });
      console.log("### ADMIN ROLE CREATED");
    }

    const existingTestUsers = await this.prisma.user.findMany({
      where: {
        OR: [
          { email: "admin@hydrotek.store" },
          { email: "user@hydrotek.store" },
        ],
      },
      select: { id: true },
    });

    if (existingTestUsers.length === 2) {
      setTimeout(() => {
        console.log("### TEST USERS ALREADY EXIST");
      }, 500);
      return;
    }

    //? Crea usuario de prueba
    const testUser = await this.user.createUser({
      email: "user@hydrotek.store",
      roleId: 1,
      name: "TEST USER",
      password: "@HYD!.",
    });

    const testAdmin = await this.user.createUser({
      email: "admin@hydrotek.store",
      roleId: 2,
      name: "TEST ADMIN",
      password: "@HYD!.",
    });

    console.log("### TEST USERS CREATED");
    console.log(testUser, testAdmin);
  }
}
