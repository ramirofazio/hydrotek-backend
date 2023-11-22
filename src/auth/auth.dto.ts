import {
  IsEmail,
  IsNotEmpty,
  IsString,
  //IsStrongPassword, // * Definir una misma validacion para back y front
  IsOptional,
  IsNumber,
  MinLength,
  MaxLength,
  ValidatorConstraintInterface,
  ValidatorConstraint,
  Validate,
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

export class initPasswordResetRequest {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
    email: string;
}

@ValidatorConstraint({ name: "isEqual", async: false })
class IsEqualConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(value: string, args: any) {
    return value === args.object[args.constraints[0]];
  }

  defaultMessage() {
    return "Las contraseñas no coinciden";
  }
}

export class confirmPasswordResetRequest {
  @IsString()
  @IsNotEmpty()
    token: string;

  @IsString()
  @IsNotEmpty()
    newPassword: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
    email: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsEqualConstraint, ["newPassword"])
    newConfirmPassword: string;
}
