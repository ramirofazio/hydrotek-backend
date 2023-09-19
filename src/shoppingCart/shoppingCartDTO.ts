

interface ProductOnCartDTO {
  quantity: number,
  productId: number,
  price?: number,
}

export interface UpdateCartDTO {
  userId: string,
  shoppingCart: {
    products : ProductOnCartDTO[],
    totalPrice: number,
  }
}