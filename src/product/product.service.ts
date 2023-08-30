import { Injectable } from "@nestjs/common";
import { data, PostProduct, CompleteProduct } from 'src/data';
import { randomUUID as uuid } from 'crypto';
import { ProductResponseDTO } from "src/DTO/product.dto";


@Injectable()
export class ProductService {
  async getProducts(): Promise<ProductResponseDTO[]> {
    return data.products.map(el => new ProductResponseDTO(el));
  }

  async getProductById(id: string): Promise<ProductResponseDTO> {
    const product = data.products.find((el) => el.id === id);
    if(!product) return;
    return new ProductResponseDTO(product);
  }

  async createProduct(body: PostProduct): Promise<ProductResponseDTO> {
    const product: CompleteProduct = {
      id: uuid(),
      createdAt: new Date().toDateString(),
      ...body,
    };
    data.products.push(product);
    return new ProductResponseDTO(product);
  }

  async updateProduct(id: string, body: CompleteProduct): Promise<ProductResponseDTO> {
    const productToUpdate = await this.getProductById(id);
    let index = null;
    if (productToUpdate) {
      index = data.products.findIndex((el) => el.id === productToUpdate.id);
      data.products[index] = { ...body };
    }
    return  new ProductResponseDTO(data.products[index]);
  }

  async deleteProduct(id: string) {
    const productIndex = data.products.findIndex((el) => el.id === id);
    if (productIndex < 0) return;
    data.products.splice(productIndex, 1);
    return data.products;
  }
}
