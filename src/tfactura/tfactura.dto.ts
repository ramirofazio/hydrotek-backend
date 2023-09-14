import { DateTime } from "luxon";

export interface TokenError {
  CodigoError: number;
  Data: string;
}

export interface RawProductResponse {
    Error: ErrorObject[];
    CodigoError: number;
    ContentEncoding?: any;
    ContentType?: string;
    JsonRequestBehavior: number;
    MaxJsonLength: number;
    RecursionLimit?: any;
    Data: string | Array<RawDataProduct>;
  }

export interface RawDataProduct {
  ProductoId: number;
  ProductoCodigo: string;
  ProductoCodigoAlternativo: string;
  ProductoNombre: string;
  ProductoDescripcion: string;
  ProductoPrecioFinal: number;
  ProductoPrecioFinalCompra: number;
  ProductoPublicado: true;
  ProductoTipo: number;
  CrearAunRepetido: false;
  ProductoImagenes: any[];
  ProductoPerfil: number;
}

export interface ErrorObject {
  Mensaje?: string;
  Nivel?: number;
}


export class Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  published: boolean;
  type: number;
  profile: number;
  updated: string;

  constructor(rawProduct: RawDataProduct) {
    const {
      ProductoId,
      ProductoNombre,
      ProductoPrecioFinal,
      ProductoDescripcion,
      ProductoPublicado,
      ProductoTipo,
      ProductoPerfil,
    } = rawProduct;
    const timestamp = DateTime.now()
      .setLocale("es")
      .toFormat("dd/MM/yyyy HH:mm");

    this.id = ProductoId;
    this.name = ProductoNombre;
    this.price = ProductoPrecioFinal;
    this.description = ProductoDescripcion;
    this.published = ProductoPublicado;
    this.type = ProductoTipo;
    this.profile = ProductoPerfil;
    this.updated = timestamp;
  }
}
