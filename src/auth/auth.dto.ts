import { IsNotEmpty, IsString } from "class-validator";

//? Aca irian mas props si loguea por 3ro (calculo)
export class signInDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  pass: string;
}
