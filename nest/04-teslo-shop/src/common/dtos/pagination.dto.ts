import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'Number of items to obtain',
    default: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Type(() => Number) // --> optional we can use enableImplicitConversion:true in main.ts instead of this
  // @Expose({ name: 'lim' }) // --> custom query param name for endpoint different than used in backend --> transform:true validation pipe in main.ts needed
  limit?: number;

  @ApiProperty({
    description: 'Number of skipped items',
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
