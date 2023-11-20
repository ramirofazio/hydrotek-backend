import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsNumber,
} from "class-validator";

export class CheckoutRequest {
  @IsString()
  @IsNotEmpty()
    userId: string;
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => requestItem)
    items: requestItem[];
}

export class requestItem {
  @IsNotEmpty()
  @IsNumber()
    id: number;

  @IsNotEmpty()
  @IsNumber()
    qty: number;
}


export interface mobbexCustomer {
  email: string;
  name: string;
  identification: string;
  uid: string;
  phone?: string;
}

export interface mobbexItem {
    description: string,
    quantity: number,
    total: number
    image: string
}

export interface mobbexBody {
    total : number,
    description: string,
    reference: string,
    currency: string,
    test: boolean,
    return_url: string,
    customer: mobbexCustomer,
    items: mobbexItem[]
}

export interface successCheckoutResponse {
    result: true,
    data : successDataCheckoutResponse

}

export interface failureCheckoutResponse {
    result: false,
    code: string,
    error: string,
}

interface successDataCheckoutResponse {
    id: string,
    url: string,
    description: string,
    currency: string,
    total: number,
    timeout: number,
    created: number,
    paymentMethods: paymentMethod[]
}

interface paymentMethod {
    group:string,
    subgroup:string,
    subgroup_title:string,
    subgroup_logo:string,
    type:string,
}