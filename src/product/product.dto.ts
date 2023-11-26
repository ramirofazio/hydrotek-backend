

export interface ProductDTO {
  id: number;
  name: string;
  usdPrice: number;
  arsPrice: number;
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

export interface AddProductImg {
  publicId: string;
  path: string;
  productId: number;
  assetId: string
}