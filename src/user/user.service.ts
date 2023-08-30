import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class UserService {
    constructor(private readonly productService : ProductService) {}
    async manageProducts() {
        const products = await this.productService.getProducts(); 
        return {user: 'test', products};
        
    }
}
