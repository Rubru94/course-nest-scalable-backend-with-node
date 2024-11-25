import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadedImageDto {
  @ApiProperty({
    example:
      'http://localhost:3000/api/files/product/5dc2bbf3-1892-4991-88f7-8c467089ef6a.jpeg',
    description: 'Uploaded image secure url',
    nullable: false,
  })
  @IsString()
  secureUrl: string;
}
