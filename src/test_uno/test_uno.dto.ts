import { CategoryType } from "src/data";
import {
  IsNumber,
  IsPositive,
  IsBoolean,
  IsNotEmpty,
  IsEnum,
  IsString,
  IsUUID,
} from "class-validator";
import { Exclude, Expose } from "class-transformer";

export class CreateTestUnoDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  published: boolean;

  @IsNumber()
  @IsPositive()
  value: number;

  @IsEnum(CategoryType)
  category: CategoryType;
}

export class EditTestUnoDTO {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  published: boolean;

  @IsNumber()
  @IsPositive()
  value: number;

  @IsEnum(CategoryType)
  category: CategoryType;
}

export class TestUnoResponseDTO {
  constructor(partial: Partial<TestUnoResponseDTO>) {
    Object.assign(this, partial);
  }

  title: string;

  description: string;

  published: boolean;

  category: CategoryType;
  //excluye props de la info de respuesta
  @Exclude()
  id: string;
  @Exclude()
  createdAt: string;
  @Exclude()
  value: number;

  //expone props, customizandolas si es necesario
  @Expose({ name: "amount" })
  transformAmount() {
    return this.value;
  }
}
