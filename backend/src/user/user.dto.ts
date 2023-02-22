import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;
}
