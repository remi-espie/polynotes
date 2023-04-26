import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class createFormDTO {
  @IsArray()
  @IsNotEmpty()
  formRows: formRow[];
}

export class formRow {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  content: any;
}
