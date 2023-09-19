import { IsNotEmpty } from "class-validator";
import { Exclude } from "class-transformer";

export class CreateUserDTO {
  //Define los campos del POST a traves del cual se crea un user
}
export class UpdateUserDTO {
  //Define los campos del PUT a traves del cual se edita un user
}
export class DeleteUserDTO {
  //Define los campos del DELETE a traves del cual se elimina un user
}
export class UserResponseDTO {
  [x: string]: any; // *  Pedir ayuda para correcto manejo de DTO (modelo UserProfile relacionado)
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

    cellPhone: number;

    avatar: string;

    adress: string;
  };
}
