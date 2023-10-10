/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface RawClientResponse {
  Error:               any[];
  CodigoError:         number;
  ContentEncoding:     null;
  ContentType:         null;
  Data:                RawDataClient[];
  JsonRequestBehavior: number;
  MaxJsonLength:       number;
  RecursionLimit:      null;
}

export interface SuccessPostClientResponse {
  Error:               any[];
  CodigoError:         number;
  ContentEncoding:     null;
  ContentType:         null;
  Data:                SuccessPostClientDataResponse;
  JsonRequestBehavior: number;
  MaxJsonLength:       number;
  RecursionLimit:      null;
}

export interface SuccessPostClientDataResponse {
  ClienteID : number
}

export interface RawDataClient {
  ClienteId:                     number;
  ClienteCodigoAlternativo:      string;
  ClientePerfil:                 number;
  ClienteCodigo:                 string;
  ClienteNombre:                 string;
  ClienteTipoDocumento:          number | null;
  ClienteNumeroDocumento:        null | string;
  ClienteDireccion:              RawClientAddress;
  ClienteEmail:                  any[];
  CategoriaImpositiva:           string;
  ClientePerfilImpositivoCodigo: string;
  CrearAunRepetido:              boolean;
  AplicacionID:                  number;
  UserIdentifier:                null;
  ApplicationPublicKey:          null;
  Token:                         null;
}

export interface ClientCreate {
  ClienteNombre:                 string;
  ClienteTipoDocumento:          number;
  ClienteNumeroDocumento:        number;
  ClienteDireccion:              AddressCreate;
  CategoriaImpositiva:           string;
  ClientePerfilImpositivoCodigo: string;
  CrearAunRepetido:              boolean;
  AplicacionID:                  number;
  UserIdentifier:                string;
  ApplicationPublicKey:          string;
  Token:                         string;
}

export interface AddressCreate {
  Calle:                string;
  Numero:               string;
  Piso:                 string;
  Departamento:         string;
  Localidad:            string;
  CodigoPostal:         string;
  Provincia:            string;
  PaisID:               null;
  PaisNombre:           string;
}

export interface RawClientAddress {
  Calle:                string;
  Numero:               string;
  Piso:                 string;
  Departamento:         string;
  Localidad:            string;
  CodigoPostal:         string;
  Provincia:            string;
  PaisID:               null;
  PaisNombre:           string;
  UserIdentifier:       null;
  ApplicationPublicKey: null;
  Token:                null;
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

export interface TFacturaUserLog {
  identifier : string,
  errorCode : number,
  data : string,
  date : string,
}
