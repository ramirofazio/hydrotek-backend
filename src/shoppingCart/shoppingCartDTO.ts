import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsNumber,
  IsOptional,
} from "class-validator";

interface ProductOnCartDTO {
  quantity: number;
  productId: number;
  price?: number;
}

export interface UpdateCartDTO {
  userId: string;
  shoppingCart: {
    products: ProductOnCartDTO[];
    totalPrice: number;
  };
}

export class NewOrderDTO {
  @IsOptional()
  @IsString()
    id: string;

  @IsOptional()
  @IsString()
    name: string;

  @IsOptional()
  @IsString()
    email: string;

  @IsNotEmpty()
  @IsString()
    fresaId: string;

  @IsNotEmpty()
  @IsNumber()
    status: number;

  @IsNotEmpty()
  @IsNumber()
    totalPrice: number;

  @IsNotEmpty()
  @IsNumber()
    discount: number;

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderProducts)
    items: OrderProducts[];
}

export class OrderProducts {
  @IsNotEmpty()
  @IsString()
    name: string;

  @IsNotEmpty()
  @IsNumber()
    productId: number;

  @IsNotEmpty()
  @IsNumber()
    quantity: number;

  @IsNotEmpty()
  @IsNumber()
    price: number;
}
