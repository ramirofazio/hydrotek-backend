import { Injectable } from "@nestjs/common";
import { env } from "process";

interface TFacturaTokenCredentialsInterface {
    UserName: string,
    Password: string,
  }
interface TFacturaProductsCredentialsInterface {
  Filtro? : string,
  UserIdentifier: string,
  ApplicationPublicKey: string,
  Token: string,
}

@Injectable()
export class TFacturaAuthData {

  TFacturaTokenCredentials:TFacturaTokenCredentialsInterface = {
    UserName: env.TFACTURA_USER_NAME,
    Password: env.TFACTURA_PASSWORD,
  };
  GET_TOKEN_URL:string = `${env.TFACTURA_BASE_URL}${env.TFACTURA_PROV_PATH}${env.TFACTURA_GET_TOKEN_PATH}`;

}

export class TFacturaProductsData {
  TFacturaProductsCredentials:TFacturaProductsCredentialsInterface = {
    UserIdentifier: env.TFACTURA_USER_IDENTIFIER,
    ApplicationPublicKey: env.TFACTURA_APPLICATION_PUBLIC_KEY,
    Token: ""
  };
  GET_PRODUCTS_URL:string = `${env.TFACTURA_BASE_URL}${env.TFACTURA_SERV_PATH}${env.TFACTURA_FAC_PATH}${env.TFACTURA_GET_PRODUCTS_PATH}`;
}

