import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PagDTO, ProductDTO, ProductsPaginatedDTO } from "./product.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Error } from "../commonDTO";
import { TfacturaService } from "src/tfactura/tfactura.service";

@Injectable()
export class ProductService {
  /* eslint-disable */
  constructor(
    private prisma: PrismaService,
    private tfacturaService: TfacturaService
  ) {}
  /* eslint-enable */

  async updateDBProducts(): Promise<string | Error> {
    try {
      const token = await this.tfacturaService.getToken();
      console.log(token);
      if (!token) {
        throw new HttpException(
          "cannot get token",
          HttpStatus.FAILED_DEPENDENCY
        );
      }
      await this.tfacturaService.getProducts();
      return "products updated successfully";
    } catch (e) {
      console.log(e);
      return {
        message: e.message,
        name: e.name,
        status: e.status,
      };
    }
  }

  async importantProducts(): Promise<ProductDTO[]> {
    const products = await this.prisma.product.findMany({
      skip: 0,
      take: 50,
    });
    return products;
  }

  async getProductDetail(id: number): Promise<ProductDTO> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product;
  }

  async getProductsPaginated({
    pag = 0,
    productsPerPage = 15,
  }: PagDTO): Promise<ProductsPaginatedDTO> {
    const quantity = await this.prisma.product.count();

    const products = await this.prisma.product.findMany({
      skip: productsPerPage * pag,
      take: productsPerPage,
    });

    return {
      quantity: Math.ceil(quantity / productsPerPage),
      products,
    };
  }
}
