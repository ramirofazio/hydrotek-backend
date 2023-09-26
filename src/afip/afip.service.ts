import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosError } from "axios";
import { catchError, firstValueFrom } from "rxjs";
import { CuitErrorResponse, CuitSuccessResponse, FullDataErrorResponse, FullTaxDataSuccessResponse } from "./afip.dto";


@Injectable()
export class AfipService {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly httpService: HttpService) {}

  async getCuitFromDni(dni: string) {
    const base = "https://afip.tangofactura.com/Index/GetCuitsPorDocumento/?NumeroDocumento=";
    const { data } = await firstValueFrom(
      this.httpService
        .get<CuitSuccessResponse | CuitErrorResponse>(`${base}${dni}`)
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw "Error obteniendo datos de CUIT";
          })
        )
    );
    return data;
  }

  async handleIdentifier(identifier:string) {
    if(identifier.length < 10) {
      const cuit : CuitSuccessResponse | CuitErrorResponse = await this.getCuitFromDni(identifier);
      if("success" in cuit) {
        const fullData = await this.getTaxData(cuit.data[0]);
        return fullData;
      }
      if("error" in cuit) {
        return cuit.error;
      }

    }
    else {
      const fullData = await this.getTaxData(identifier);
      return fullData;
    }

  }

  async getTaxData(cuit:string) {
    const base = "https://afip.tangofactura.com/Index/GetFullContribuyente/?cuit=";

    const { data } = await firstValueFrom(
      this.httpService
        .get<FullTaxDataSuccessResponse | FullDataErrorResponse>(`${base}${cuit}`)
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw "Error obteniendo datos de CUIT";
          })
        )
    );
    return data;
  }



}
