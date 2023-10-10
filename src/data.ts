/* eslint-disable no-unused-vars */
export const data: Data = {
  products: [],
};

export interface PostTestUno {
  id?: string;
  title: string;
  description: string;
  published: boolean;
  value: number;
  category: CategoryType;
}

export interface CompleteTestUno {
  id: string;
  title: string;
  createdAt: string;
  description: string;
  published: boolean;
  value: number;
  category: CategoryType;
}

export enum CategoryType {
  MACETAS = "macetas",
  OTROS = "otros",
}

interface Data {
  products: CompleteTestUno[];
}

data.products.push({
  id: "123b1864-45df-41f4-8e5d-255e0bf76b05",
  title: "fertilizante 200ml",
  createdAt: "2023-08-25",
  description: null,
  published: true,
  value: 2500,
  category: CategoryType.OTROS,
});

data.products.push({
  id: "2f93956a-23a6-464e-90f5-7bd5b6296ecc",
  title: "maceta nro 1",
  createdAt: "2023-08-25",
  description: null,
  published: true,
  value: 1500,
  category: CategoryType.MACETAS,
});

data.products.push({
  id: "123b1864-45df-41f4-8e5d-255e0bf76b05",
  title: "fertilizante 200ml",
  createdAt: "2023-08-25",
  description: null,
  published: true,
  value: 2500,
  category: CategoryType.OTROS,
});
