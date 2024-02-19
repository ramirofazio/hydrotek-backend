import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from "class-validator";

export class PromotionalCodeDTO {
  @IsNotEmpty()
  @IsString()
    code: string;

  @IsNotEmpty()
  @IsNumber()
    discount: number;
}

export class EditPromotionalCodeDTO {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
    id: string;

  @IsNotEmpty()
  @IsString()
    code: string;

  @IsNotEmpty()
  @IsNumber()
    discount: number;
}

export class DeletePromotionalCodeDTO {
  @IsNotEmpty()
  @IsString()
    id: string;
}
