import {
    IsArray,
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateIf,
} from 'class-validator';


export class formDTO {

    @IsArray()
    @IsNotEmpty()
    formRows: formRow[];

    @IsString()
    @IsNotEmpty()
    formId: string;

    @IsString()
    @IsNotEmpty()
    user: string;
}

export class createFormDTO {

    @IsArray()
    @IsNotEmpty()
    formRows: formRow[];
}

export class formRow {

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    content: any;
}