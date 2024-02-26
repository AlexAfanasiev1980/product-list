export interface IProducts {
  brand: null | string;
  id: string;
  product: string;
  price: number;
}

export interface IProductsId {
  result: string[];
}

export interface IProductsData {
  result: Array<{
    brand: string | null;
    id: string;
    price: number;
    product: string;
  }>;
}

export interface ProductState {
  pagination?: number;
  productsId: string[];
  products: IProducts[];
  filterList: IProducts[];
  fields: string[];
  loading: boolean;
}
