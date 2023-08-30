import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    ParseEnumPipe,
    ParseUUIDPipe
  } from "@nestjs/common";
  
  import { CreateProductDTO, EditProductDTO } from "src/DTO/product.dto";
import { ProductService } from "./product.service";
  
  @Controller("products")
  export class ProductController {
    constructor(private readonly ProductService: ProductService) {}
  
    @Get()
    async getProducts(): Promise<any> {
      return this.ProductService.getProducts();
    }
  
    //dejo comentado este endpoint, sirve como ejemplo de uso
    //de ParseEnumPipe
  
    // @Get("/:type")
    // async getProductById(@Param("type", new ParseEnumPipe(CategoryType)) type: string): Promise<any> {
    //   return {type};
    // }
  
    @Get("/:id")
    async getProductById(@Param("id", ParseUUIDPipe) id: string): Promise<any> {
      
      return this.ProductService.getProductById(id);
    }
  
    @Post()
    async createProduct(@Body() body: CreateProductDTO): Promise<any> {
      return this.ProductService.createProduct(body);
    }
  
    @Put("/:id")
    async updateProduct(@Param("id", ParseUUIDPipe) id: string, @Body() body: EditProductDTO) {
      return this.ProductService.updateProduct(id, body);
    }
  
    @Delete("/:id")
    async deleteProduct(@Param("id", ParseUUIDPipe) id: string) {
      return this.ProductService.deleteProduct(id);
    }
  }
  