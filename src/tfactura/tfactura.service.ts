import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosError } from "axios";
import { catchError, firstValueFrom } from "rxjs";
import { TFacturaAuthData } from "./tfactura.credentials";
@Injectable()
export class TfacturaService {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly httpService: HttpService) {}
  async getToken(): Promise<string | object> {


    const { GET_TOKEN_URL, TFacturaTokenCredentials } = new TFacturaAuthData();

    const { data } = await firstValueFrom(
      this.httpService.post<string | object>(GET_TOKEN_URL,
        TFacturaTokenCredentials)
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw "An error happened!";
          }),
        ),
    );
    if(typeof data === "string") {
      console.log("todo bien");
    }
    else {

      //manejo de errores de acuerdo a estas props, ya que tfactura siempre devuelve 200
      // console.log("data", data.Error, data.CodigoError);
      console.log("todo mal");

    }

    return data;
  }
}
