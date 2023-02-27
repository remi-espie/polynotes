import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import {Page} from "./page.schema";

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

    @IsDate()
    @IsOptional()
    modified: Date;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsOptional()
    content: Page[];

    @IsOptional()
    @IsString()
    subContent: string
}