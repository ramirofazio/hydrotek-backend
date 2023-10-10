import {
  IsEmail,
  IsNotEmpty,
  IsString,
  //IsStrongPassword, // * Definir una misma validacion para back y front
  IsOptional,
  IsNumber,
  MinLength,
  MaxLength,
} from "class-validator";

export class signUpDto {
  @IsString()
  @IsNotEmpty()
    name: string;

  @IsOptional()
  @IsNumber()
  @MinLength(7)
  @MaxLength(11)
    dni: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
    email: string;

  @IsString()
  //@IsStrongPassword()
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

export class googleSignInDTO {
  @IsString()
  @IsNotEmpty()
    email: string;
  @IsString()
  @IsNotEmpty()
    name: string;
  @IsString()
  @IsNotEmpty()
    picture: string;
}
