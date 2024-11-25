import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({
    description: 'File binary',
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File;
}
