import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";

export class signUpDto {
  @IsString()
  @IsNotEmpty()
    name: string;

  dni: number;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
    email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
    password: string;
}
export class signInDto {
  //? Aca irian mas props si loguea por 3ro (calculo)
  @IsString()
  @IsNotEmpty()
    email: string;

  @IsString()
  @IsNotEmpty()
    pass: string;
}
