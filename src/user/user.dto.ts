import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  MaxLength,
  MinLength,
  IsNumber,
  IsEnum,
  ValidateNested,
  IsUUID,
  IsBoolean,
  IsNumberString,
} from "class-validator";
import { Exclude } from "class-transformer";

export enum Roles {
  // eslint-disable-next-line no-unused-vars
  USER = 1,
  // eslint-disable-next-line no-unused-vars
  ADMIN = 2,
}

export class UserProfileDTO {
  @IsOptional()
  @IsString()
    avatar: string;

  @IsOptional()
  @IsNumberString()
    cellPhone: string;

  @IsOptional()
  @IsString()
    address: string;
}
export class CreateUserDTO {
  //Define los campos del POST a traves del cual se crea un user

  @IsOptional()
  @IsNumber()
    tFacturaId: number;

  @IsString()
  @IsNotEmpty()
    name: string;

  @IsEmail()
  @IsNotEmpty({ message: "el Mail es un campo requerido" })
    email: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(11)
    dni: string;

  @IsOptional()
  @IsBoolean()
    active: boolean;

  @IsOptional()
  @IsUUID()
    id: string;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum(Roles)
    roleId: number;

  @IsString()
  @MinLength(7)
  @MaxLength(11)
    password: string;

  @IsOptional()
  @ValidateNested()
    profile: UserProfileDTO;
}
export class UpdateUserDTO {
  //Define los campos del PUT a traves del cual se edita un user
}
export class DeleteUserDTO {
  //Define los campos del DELETE a traves del cual se elimina un user
}
export class UserResponseDTO {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any; // *  Pedir ayuda para correcto manejo de DTO (modelo UserProfile relacionado)
  /* eslint-enable */
  //Define los campos que retorna el GET para obtener un User
  constructor(partial: Partial<UserResponseDTO>) {
    Object.assign(this, partial);
  }

  id: string;

  name: string;

  dni: number;

  email: string;

  role: { type: string };

  @Exclude()
    active: boolean;
  @Exclude()
    password: string;
}

export class UserSignInResponseDTO {
  @IsNotEmpty()
    session: { id: string; email: string; role: string };

  @IsNotEmpty()
    accessToken: string;

  @Exclude()
    profile: {
    userName: string;

    cellPhone: number;

    avatar: string;

    adress: string;
  };
}

export interface UserSignInResponseDTO2 {
  session: { id: string; email: string; role: string };

  accessToken: string;

  shoppingCart?: object;

  profile: {
    userName: string;
    profile: {

    cellPhone: string;

    avatar: string;

    address: string;
  };
}
}