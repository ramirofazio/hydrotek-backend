import { Decimal } from "@prisma/client/runtime/library";

export interface ProductDTO {
  id: number;
  name: string;
  price: Decimal;
  description: string;
  published: boolean;
  type: number;
  profile: number;
  updated: string;
}

export interface PagDTO {
  pag: number;
  productsPerPage?: number;
}

export interface ProductsPaginatedDTO {
  quantity: number;
  products: ProductDTO[]
}