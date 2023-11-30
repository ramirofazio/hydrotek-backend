import { Controller, Get, Body, Param, Post, Put, Query } from "@nestjs/common";
import { ProductService } from "./product.service";
import {
  ProductDTO,
  PagDTO,
  ProductsPaginatedDTO,
  AddProductImg,
} from "./product.dto";

@Controller("product")
export class ProductController {
  /* eslint-disable */
  constructor(private productService: ProductService) {}
  /* eslint-enable */

  @Get("featured-products")
  async getFeaturedProducts() {
    return await this.productService.getFeaturedProducts();
  }

  @Put("toggle-featured-product")
  async toggleFeaturedProduct(@Query("id") id: number) {
    return await this.productService.toggleFeaturedProduct(id);
  }

  @Get("updateDB")
  async updateDBProductsAndUsd(@Param("full") full: boolean) {
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

  @Put("/img/add")
  async addProductImg(@Body() body: AddProductImg): Promise<any> {
    return await this.productService.addProductImg(body);
  }

  @Post("/pag")
  findbyId(@Body() body: PagDTO): Promise<ProductsPaginatedDTO> {
    return this.productService.getProductsPaginated(body);
  }
}
