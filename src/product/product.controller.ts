import { Controller, Get, Body, Param, Post } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductDTO, PagDTO, ProductsPaginatedDTO } from "./product.dto";

@Controller("product")
export class ProductController {
  /* eslint-disable */
  constructor(private productService: ProductService) {}
  /* eslint-enable */

  @Get("updateDB")
  async updateDBProducts() {
    return await this.productService.updateDBProducts();
  }

  @Get("updateDB/full")
  async updateDBProductsAndUsd() {
    return await this.productService.updateDBProducts(true);
  }

  @Get()
  async getImportantProducts() {
    return await this.productService.importantProducts();
  }

  @Get("detail/:id")
  async getProductDetail(@Param("id") id: number): Promise<ProductDTO> {
    return await this.productService.getProductDetail(id);
  }

  @Post("/pag")
  findbyId(@Body() body: PagDTO): Promise<ProductsPaginatedDTO> {
    return this.productService.getProductsPaginated(body);
  }


}
