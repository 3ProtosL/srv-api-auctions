import { Type } from 'class-transformer'
import {
    IsOptional,
    IsInt,
    IsString,
    Min,
    Max,
    IsNotEmpty,
} from 'class-validator'

export class PaginationItemssDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number

    @IsOptional()
    @IsString()
    nextCursor?: string // Ahora será un string en Base64 que oculta el estado del cursor compuesto

    @IsOptional()
    @IsString()
    previousCursor?: string

    @IsString()
    @IsNotEmpty()
    sortBy: string

    @IsString()
    @IsNotEmpty()
    sortDirection: string
}
