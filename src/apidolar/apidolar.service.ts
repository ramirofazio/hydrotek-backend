import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";
import { apiDolarResponse } from "./apidolar.dto";
import { PrismaService } from "src/prisma/prisma.service";
@Injectable()
export class ApidolarService {
  constructor(
        // eslint-disable-next-line no-unused-vars
        private readonly httpService: HttpService,
        // eslint-disable-next-line no-unused-vars
    private prisma: PrismaService,
  ) {}


  async storeUsdValue() {

    const data = await this.getDolarApiData();

    await this.prisma.dollarPrice.create({
      data: {
        date: data.fecha,
        price : Number(data.venta),
      }
    });

    return data.venta;
  }

  async getDolarApiData() {
    const { data } = await firstValueFrom(
      this.httpService
        .get<apiDolarResponse>(process.env.DOLAR_API_URL)
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw "An error happened!";
          })
        )
    );

    return data;
  }


  async getSimpleUsdValue() {
    const lastRow =  await this.prisma.dollarPrice.findFirst({
      select: {
        id: false,
        date: false,
        price: true,
      },
      orderBy: [
        {
          id : "desc"
        }
      ]
    });
    if(!lastRow) {
      throw new HttpException(
        "No se encontró un valor almacenado de Cotización",
        HttpStatus.BAD_REQUEST
      );
    }
    return lastRow.price;
  }

  async getFullUsdValue() {
    const lastRow =  await this.prisma.dollarPrice.findFirst({
      select: {
        id: true,
        date: true,
        price: true,
      },
      orderBy: [
        {
          id : "desc"
        }
      ]
    });
    return lastRow;
  }
}
