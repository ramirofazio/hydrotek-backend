import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosError } from "axios";
import { catchError, firstValueFrom } from "rxjs";
import { TFacturaAuthData, TFacturaProductsData } from "./tfactura.credentials";
//linea comentada para evitar errores eslint.
// import { Cron, CronExpression } from "@nestjs/schedule";
import { DateTime } from "luxon";
import { PrismaService } from "src/prisma/prisma.service";
import { Product, RawProductResponse, TokenError } from "./tfactura.dto";
import { isArray } from "class-validator";



@Injectable()
export class TfacturaService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly httpService: HttpService,
    // eslint-disable-next-line no-unused-vars
    private prisma: PrismaService
  ) {}


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
    const { GET_PRODUCTS_URL, TFacturaProductsCredentials } =
      new TFacturaProductsData();
    const lastToken = await this.prisma.token.findFirst({
      orderBy: {
        id: "desc",
      },
    });
    TFacturaProductsCredentials.Token = lastToken.token;

    const { data } = await firstValueFrom(
      this.httpService
        .post<RawProductResponse>(GET_PRODUCTS_URL, TFacturaProductsCredentials)
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw "An error happened!";
          })
        )
    );

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
    const res : RawProductResponse =await  this.getProducts();
    if(res.Error.length) {
      //manejo el error
      if(typeof res.Data === "string") {
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
    if(isArray(res.Data)) {
      const formatted: Product[] = [];
      res.Data.forEach(el => {
        formatted.push(new Product(el));
      });
      await this.prisma.$transaction(
        formatted.map(el => {
          return this.prisma.product.upsert({
            where : { id : el.id },
            create: { ...el },
            update: { ...el }
          });
        })
      );


    }
  }

}