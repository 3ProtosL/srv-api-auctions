import { Type, Transform } from 'class-transformer';
import {
    IsOptional,
    IsInt,
    IsString,
    Min,
    Max,
    IsNotEmpty,
} from 'class-validator';

export class PaginationItemssDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value?.trim() === '' ? undefined : value))
    nextCursor?: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value?.trim() === '' ? undefined : value))
    previousCursor?: string;

    @IsString()
    @IsNotEmpty()
    sortBy: string = '_id'; // Valor por defecto conveniente

    @IsString()
    @IsNotEmpty()
    sortDirection: string = 'DESC'; // Valor por defecto conveniente
}