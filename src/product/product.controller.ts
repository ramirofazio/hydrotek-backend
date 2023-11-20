import { Controller, Get, Body, Param, Post, Query } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductDTO, PagDTO, ProductsPaginatedDTO } from "./product.dto";

@Controller("product")
export class ProductController {
  /* eslint-disable */
  constructor(private productService: ProductService) {}
  /* eslint-enable */

  @Get("updateDB")
  async updateDBProductsAndUsd(@Query("full") full: boolean) {
    return await this.productService.updateDBProducts(full);
  }

  @Get()
  async getImportantProducts() {
    return await this.productService.importantProducts();
  }

  @Get("all")
  async getAllProducts() {
    return await this.productService.getAllProducts();
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
