

interface ProductOnCartDTO {
  quantity: number,
  productId: string,
  price?: number,
}

export interface CreateDTO {
  userId: string,
  shoppingCart: {
    products : productOnCartDTO[],
    totalPrice: number,
  }
}