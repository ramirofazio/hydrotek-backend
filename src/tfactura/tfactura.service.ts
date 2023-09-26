import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosError } from "axios";
import { catchError, firstValueFrom } from "rxjs";
import {
  TFacturaAuthData,
  TFacturaClientsCreate,
  TFacturaClientsData,
  TFacturaProductsData,
} from "./tfactura.credentials";
//linea comentada para evitar errores eslint.
// import { Cron, CronExpression } from "@nestjs/schedule";

import { DateTime } from "luxon";
import { PrismaService } from "src/prisma/prisma.service";
import {
  ClientCreate,
  Product,
  RawClientResponse,
  RawProductResponse,
  SuccessPostClientResponse,
  TokenError,
} from "./tfactura.dto";
import { isArray } from "class-validator";
import { Token } from "@prisma/client";
import { AfipService } from "src/afip/afip.service";

@Injectable()
export class TfacturaService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly httpService: HttpService,
    // eslint-disable-next-line no-unused-vars
    private prisma: PrismaService,
    // eslint-disable-next-line no-unused-vars
    private afipService: AfipService
  ) {}

  //Función auxiliar para obtener ultimo token
  async getLastToken(): Promise<string> {
    const res: Token = await this.prisma.token.findFirst({
      orderBy: {
        id: "desc",
      },
    });
    return res.token;
  }

  //Solicitud de Token a TFactura
  async getToken(): Promise<string | TokenError> {
    const { GET_TOKEN_URL, TFacturaTokenCredentials } = new TFacturaAuthData();

    const { data } = await firstValueFrom(
      this.httpService
        .post<string | TokenError>(GET_TOKEN_URL, TFacturaTokenCredentials)
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw "An error happened!";
          })
        )
    );

    return data;
  }

  //Solicitud de productos a TFactura. Utiliza ultimo token guardado en db
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async getProducts(): Promise<RawProductResponse> {
    const { GET_PRODUCTS_URL, TFacturaBaseCredentials } =
      new TFacturaProductsData();
    const lastToken = await this.getLastToken();
    TFacturaBaseCredentials.Token = lastToken;

    const { data } = await firstValueFrom(
      this.httpService
        .post<RawProductResponse>(GET_PRODUCTS_URL, TFacturaBaseCredentials)
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw "An error happened!";
          })
        )
    );

    return data;
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  async getClients(): Promise<RawClientResponse> {
    const { GET_CLIENTS_URL, TFacturaBaseCredentials } =
      new TFacturaClientsData();
    const lastToken = await this.getLastToken();
    TFacturaBaseCredentials.Token = lastToken;
    const { data } = await firstValueFrom(
      this.httpService
        .post<RawClientResponse>(GET_CLIENTS_URL, TFacturaBaseCredentials)
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw "An error happened!";
          })
        )
    );
    console.log(data);
    return data;
  }
  //Posteo de ultimo token en DB
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async postToken() {
    const token = await this.getToken();
    const timestamp = DateTime.now()
      .setLocale("es")
      .toFormat("dd/MM/yyyy HH:mm");
    console.log(timestamp);

    if (typeof token === "string") {
      await this.prisma.token.create({
        data: {
          token: token,
          validUntil: timestamp,
        },
      });
    } else {
      await this.prisma.tokenLog.create({
        data: {
          errorCode: token.CodigoError,
          data: token.Data,
          date: timestamp,
        },
      });
    }
  }

  //Posteo de productos en DB. Se realiza a traves de un $transaction
  //ya que esta estructura sale bien o mal pero siempre en BLOQUE (100%)
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async postProducts() {
    const res: RawProductResponse = await this.getProducts();
    if (res.Error.length) {
      //manejo el error
      if (typeof res.Data === "string") {
        const timestamp = DateTime.now()
          .setLocale("es")
          .toFormat("dd/MM/yyyy HH:mm");
        await this.prisma.productLog.create({
          data: {
            errorCode: res.CodigoError,
            data: res.Data,
            date: timestamp,
          },
        });
      }
    }
    if (isArray(res.Data)) {
      const formatted: Product[] = [];
      res.Data.forEach((el) => {
        formatted.push(new Product(el));
      });
      await this.prisma.$transaction(
        formatted.map((el) => {
          return this.prisma.product.upsert({
            where: { id: el.id },
            create: { ...el },
            update: { ...el },
          });
        })
      );
    }
  }




  getCategory = (RI:boolean, M:boolean, EX:boolean, CF:boolean) => {

    switch (true) {
    case RI:
      return "RI";
    case M:
      return "M";
    case EX:
      return "EX";
    case CF:
      return "CF";

    default:
      return "CF";

    }

  };


  async createUser(identifier:string) {

    const idTypeTranslator = {
      CUIT : 2,
      DNI : 1
    };

    const lastToken = await this.getLastToken();

    const fullTaxData = await this.afipService.handleIdentifier(identifier);
    if(typeof fullTaxData === "object") {
      if("error" in fullTaxData === false && "Contribuyente" in fullTaxData) {
        const { idPersona, tipoClave, nombre, domicilioFiscal, EsRI, EsMonotributo, EsExento, EsConsumidorFinal } = fullTaxData.Contribuyente;
        const newClient:ClientCreate = {
          ClienteNombre : nombre,
          ClienteTipoDocumento: idTypeTranslator[tipoClave],
          ClienteNumeroDocumento: idPersona,
          ClienteDireccion: {
            Calle:                domicilioFiscal.direccion,
            Numero:               "",
            Piso:                 "",
            Departamento:         "",
            Localidad:            domicilioFiscal.localidad,
            CodigoPostal:         domicilioFiscal.codPostal,
            Provincia:            domicilioFiscal.nombreProvincia,
            PaisID:               null,
            PaisNombre:           "Argentina",
          },
          CategoriaImpositiva :  this.getCategory(EsRI, EsMonotributo, EsExento, EsConsumidorFinal),
          ClientePerfilImpositivoCodigo :  this.getCategory(EsRI, EsMonotributo, EsExento, EsConsumidorFinal),
          CrearAunRepetido :  false,
          AplicacionID :  0,
          UserIdentifier :  process.env.TFACTURA_USER_IDENTIFIER,
          ApplicationPublicKey :  process.env.TFACTURA_APPLICATION_PUBLIC_KEY,
          Token :  lastToken,
        };
        try {
          const { POST_CLIENTS_URL } = new TFacturaClientsCreate();

          const { data } = await firstValueFrom(
            this.httpService
              .post<SuccessPostClientResponse>(POST_CLIENTS_URL, newClient)
              .pipe(
                catchError((error: AxiosError) => {
                  console.log(error);
                  throw "An error happened!";
                })
              )
          );

          if(!data.Error.length) {
            return data.Data;
          }
          else {
            //usar identifier para almacenar casos en los que tfactura falle
            console.log("fallo", identifier);

            return "Error";
          }
        } catch (error) {
          return error;
        }
      }
    }


  }
}
