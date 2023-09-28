import { Injectable } from "@nestjs/common";
import { env } from "process";

interface TFacturaTokenCredentialsInterface {
    UserName: string,
    Password: string,
  }
interface TFacturaBaseCredentialsInterface {
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

export class TFacturaBaseData {
  TFacturaBaseCredentials:TFacturaBaseCredentialsInterface = {
    UserIdentifier: env.TFACTURA_USER_IDENTIFIER,
    ApplicationPublicKey: env.TFACTURA_APPLICATION_PUBLIC_KEY,
    Token: ""
  };
}

export class TFacturaProductsData extends TFacturaBaseData {
  GET_PRODUCTS_URL:string = `${env.TFACTURA_BASE_URL}${env.TFACTURA_SERV_PATH}${env.TFACTURA_FAC_PATH}${env.TFACTURA_GET_PRODUCTS_PATH}`;
}

export class TFacturaClientsData extends TFacturaBaseData {
  GET_CLIENTS_URL:string = `${env.TFACTURA_BASE_URL}${env.TFACTURA_SERV_PATH}${env.TFACTURA_FAC_PATH}${env.TFACTURA_GET_CLIENTS_PATH}`;
}

export class TFacturaClientsCreate {
  POST_CLIENTS_URL:string = `${env.TFACTURA_BASE_URL}${env.TFACTURA_SERV_PATH}${env.TFACTURA_FAC_PATH}${env.TFACTURA_POST_CLIENTS_PATH}`;
}
