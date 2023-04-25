import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class PageDto {
  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsArray()
  @IsOptional()
  reader: string[];

  @IsArray()
  @IsOptional()
  writer: string[];

  @IsDateString()
  @IsOptional()
  modified: Date;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  parentId: string;

  @IsOptional()
  @IsArray()
  subContent: [];
}

export class createPageDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
