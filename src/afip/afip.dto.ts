//desactivo el warning de anys en este archivo ya que nose que puede llegar en esos campos
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  IsNotEmpty,
  IsNumberString,
  MinLength,
  MaxLength,
  IsString
} from "class-validator";


export class IdentifierDTO {

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(7)
  @MaxLength(11)
    identifier: string;
}

export class DniDTO {

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(7)
  @MaxLength(11)
    identifier: string;
}

export class CuitDTO {

  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  @MaxLength(11)
    identifier: string;
}


export interface CuitSuccessResponse {
  success : string,
  data: string[]
}

export interface CuitErrorResponse {
  error : string,
  numeroDocumento: number
}

export interface FullDataErrorResponse {
  error: string,
  cuitSolicitada: number
}


export interface FullTaxDataSuccessResponse {
  errorGetData:  boolean;
  Contribuyente: Contribuyente;
}

export interface Contribuyente {
  ClienteCodigo:          null;
  ClienteEmail:           null;
  idPersona:              number;
  tipoPersona:            string;
  tipoClave:              string;
  estadoClave:            string;
  nombre:                 string;
  mesCierre:              number;
  tipoDocumento:          string;
  impuestos:              any[];
  PerfilImpositivoCodigo: null;
  ListaImpuestos:         any[];
  Vencimientos:           any[];
  idDependencia:          number;
  Dependencia:            null;
  DomicilioDependencia:   null;
  fechaNacimiento:        null;
  domicilioFiscal:        DomicilioFiscal;
  actividades:            any[];
  categoriasMonotributo:  any[];
  ListaActividades:       any[];
  EsRI:                   boolean;
  EsMonotributo:          boolean;
  EsExento:               boolean;
  EsConsumidorFinal:      boolean;
  ErroresObteniendoDatos: any[];
  Domicilios:             any[];
  Sexo:                   null;
  FechaNacimiento:        null;
}

export interface DomicilioFiscal {
  direccion:       string;
  localidad:       string;
  codPostal:       string;
  idProvincia:     number;
  nombreProvincia: string;
  datoAdicional:   string;
  tipoDomicilio:   null;
}

