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

export enum Roles {
  // eslint-disable-next-line no-unused-vars
  USER = 1,
  // eslint-disable-next-line no-unused-vars
  ADMIN = 2,
}

//DTO para validar estructura de profile de usuario
export class UserProfileDTO {
  @IsOptional()
  @IsNumber()
  id: number;

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

export class UserSession {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: "el Mail es un campo requerido" })
  email: string;

  @IsOptional()
  @IsUUID()
  id: string;
}

//DTO para validar data al momento de crear un usuario
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

//DTO para validar data al momento de updatear un usuario
export class UpdateUserDTO {
  @IsNotEmpty()
  @ValidateNested()
  session: UserSession;

  @IsOptional()
  @ValidateNested()
  profile: UserProfileDTO;
}

//DTO para validar estructura de session de usuario

interface UserProfileInterface {
  id?: number;

  avatar: string;

  cellPhone: string;

  address: string;
}
export interface TrueUserDTO {
  session: {
    id: string;
    dni: number;
    email: string;
    role: string;
    name: string;
  };

  accessToken?: string;

  shoppingCart?: object;

  profile: UserProfileInterface;

  savedPosts: SavedPosts[];
}

export class TrueUserTransformer {
  session: {
    id: string;
    dni: number;
    email: string;
    role: string;
    name: string;
  };

  accessToken?: string;

  shoppingCart?: object;

  profile: UserProfileInterface;

  savedPosts: SavedPosts[];
  constructor(user: RawUserDTO, accessToken: string) {
    const { id, dni, email, role, name, shoppingCart, profile, savedPosts } =
      user;
    this.session = {
      dni: dni,
      id: id,
      email: email,
      role: role.type,
      name: name,
    };
    this.shoppingCart = shoppingCart;
    this.accessToken = accessToken;
    this.profile = profile;
    this.savedPosts = savedPosts;
  }
}

export interface RawUserDTO {
  id: string;
  dni: number;
  email: string;
  password: string;
  role: { type: string };
  name: string;
  shoppingCart?: object;
  profile: UserProfileInterface;
  savedPosts: SavedPosts[];
}

export interface SimpleUserDTO {
  id: string;
  dni: number;
  email: string;
  password: string;
  role: { type: string };
  name: string;
}

// export class TrueUserDTO {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   [x: string]: any; // *  Pedir ayuda para correcto manejo de DTO (modelo UserProfile relacionado)
//   /* eslint-enable */
//   //Define los campos que retorna el GET para obtener un User
//   constructor(partial: Partial<TrueUserDTO>) {
//     Object.assign(this, partial);
//   }

//   id: string;

//   name: string;

//   dni: number;

//   email: string;

//   role: { type: string };

//   @Exclude()
//     active: boolean;
//   @Exclude()
//     password: string;
// }

// export class TrueUserDTO {
//   @IsNotEmpty()
//     session: { id: string; email: string; role: string };

//   @IsNotEmpty()
//     accessToken: string;

//   @Exclude()
//     profile: {
//     id: number;

//     cellPhone: string;

//     avatar: string;

//     address: string;
//   };
// }

// export interface TrueUserDTO {
//   session: { id: string; email: string; role: string; name: string };

//   accessToken: string;

//   shoppingCart?: object;

//   profile: {
//     userName: string;
//     profile: {
//       cellPhone: string;

//       avatar: string;

//       address: string;
//     };
//   };

//   savedPosts: SavedPosts[];
// }

//Estructura de savedPosts
export interface SavedPosts {
  post: Post;
  postId: string;
}

//Estructura de Posts
interface Post {
  id: string;
  publishDate: string | any;
  title: string;
  text: string;
  postAssets: PostAssets[];
}

//Estructura de PostsAssets
interface PostAssets {
  id: number;
  type: string;
  path: string;
}

export class updatePasswordDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  actualPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  newConfirmPassword: string;
}
