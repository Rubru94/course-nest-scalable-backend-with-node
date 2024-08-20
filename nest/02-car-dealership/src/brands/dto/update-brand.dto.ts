import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

// export class UpdateBrandDto extends PartialType(CreateBrandDto) {}

export class UpdateBrandDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  readonly id: string;

  @IsString()
  @MinLength(1)
  name: string;
}
