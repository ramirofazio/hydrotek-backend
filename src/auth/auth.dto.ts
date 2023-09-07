import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsOptional,
} from "class-validator";

export class signUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  dni: number | undefined;

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
