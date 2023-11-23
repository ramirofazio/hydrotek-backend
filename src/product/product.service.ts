import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import {
  AddProductImg,
  PagDTO,
  ProductDTO,
  ProductsPaginatedDTO,
} from "./product.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Error } from "../commonDTO";
import { TfacturaService } from "src/tfactura/tfactura.service";
import { ApidolarService } from "src/apidolar/apidolar.service";
// import { Cron } from "@nestjs/schedule";
@Injectable()
export class ProductService {
  /* eslint-disable */
  constructor(
    private prisma: PrismaService,
    private tfacturaService: TfacturaService,
    private apidolarService: ApidolarService
  ) {}
  /* eslint-enable */

  async updateDBProducts(updateUsd = false): Promise<string | Error> {
    try {
      const token = await this.tfacturaService.postToken();
      if (!token) {
        throw new HttpException(
          "cannot get token",
          HttpStatus.FAILED_DEPENDENCY
        );
      }
      if (updateUsd) {
        await this.apidolarService.storeUsdValue();
      }
      await this.tfacturaService.postProducts();
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

  async manualUpdate(): Promise<string | Error> {
    return await this.updateDBProducts();
  }

  //la expresion del cron se lee: "(segundos) (minutos) (horas) (dias del mes) (meses) (dias de la semana)"
  //Para los dias de la semana, domingo es 0. Se configura para ejecutarse todos los miercoles a las 10 am
  //@Cron("0 0 10 * * 3")
  async autoUpdate(): Promise<string | Error> {
    return await this.updateDBProducts(true);
  }

  async importantProducts(): Promise<ProductDTO[]> {
    const products = await this.prisma.product.findMany({
      skip: 0,
      take: 50,
    });
    return products;
  }

  async getAllProducts(): Promise<ProductDTO[]> {
    return await this.prisma.product.findMany({
      orderBy: { name: "asc" },
      include: {
        images: true,
      },
    });
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
      include: { images: { select: { path: true } } },
    });

    return {
      quantity: Math.ceil(quantity / productsPerPage),
      products,
    };
  }
  async addProductImg(data: AddProductImg) {
    try {
      const { productId, path, asset_id, publicId } = data;
      console.log(data);
      const product = await this.prisma.productImage.create({
        data: {
          id: asset_id,
          publicId,
          path,
          productId,
        },
      });
      console.log(product);
      return product;
    } catch (e) {
      console.log(e);
    }
  }
}
