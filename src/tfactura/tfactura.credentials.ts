import { Injectable } from "@nestjs/common";
import { env } from "process";

interface TFacturaTokenCredentialsInterface {
    UserName: string,
    Password: string,
  }
@Injectable()
export class TFacturaAuthData {

  TFacturaTokenCredentials:TFacturaTokenCredentialsInterface = {
    UserName: process.env.TFACTURA_USER_NAME,
    Password: env.TFACTURA_PASSWORD,
  };
  GET_TOKEN_URL:string = `${env.TFACTURA_BASE_URL}${env.TFACTURA_PROV_PATH}${env.TFACTURA_GET_TOKEN_PATH}`;

}

