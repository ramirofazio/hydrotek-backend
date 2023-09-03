import { Injectable } from "@nestjs/common";
import { data, PostTestUno, CompleteTestUno } from "src/data";
import { randomUUID as uuid } from "crypto";
import { TestUnoResponseDTO } from "./test_uno.dto";
import { PrismaService } from "../prisma/prisma.service";


@Injectable()
export class TestUnoService {
  // eslint-disable-next-line no-unused-vars
  constructor(private prisma: PrismaService) {}
  async getTestUnos(): Promise<TestUnoResponseDTO[]> {
    return data.products.map((el) => new TestUnoResponseDTO(el));
  }

  async getTestUnoById(id: string): Promise<TestUnoResponseDTO> {
    const product = data.products.find((el) => el.id === id);
    if (!product) {return;}
    return new TestUnoResponseDTO(product);
  }

  async createTestUno(body: PostTestUno): Promise<TestUnoResponseDTO> {
    const product: CompleteTestUno = {
      id: uuid(),
      createdAt: new Date().toDateString(),
      ...body,
    };
    data.products.push(product);
    return new TestUnoResponseDTO(product);
  }

  async updateTestUno(
    id: string,
    body: CompleteTestUno,
  ): Promise<TestUnoResponseDTO> {
    const productToUpdate = await this.getTestUnoById(id);
    let index = null;
    if (productToUpdate) {
      index = data.products.findIndex((el) => el.id === productToUpdate.id);
      data.products[index] = { ...body };
    }
    return new TestUnoResponseDTO(data.products[index]);
  }

  async deleteTestUno(id: string) {
    const productIndex = data.products.findIndex((el) => el.id === id);
    if (productIndex < 0) {return;}
    data.products.splice(productIndex, 1);
    return data.products;
  }

  async postCategory() {
    return await this.prisma.testCategory.create({
      data: {
        value: 100,
      }
    });
  }

  async postTest() {
    return await this.prisma.test.create({
      data: {
        title: "test",
        value: 2,
        categoryId: 2,
      }
    });
  }

  async getAllTests() {
    return await this.prisma.test.findMany();

  }

  async getTestsByCategory(cat : number) {

    return await this.prisma.test.findMany({
      where: {
        categoryId : cat
      }
    });
  }
}
