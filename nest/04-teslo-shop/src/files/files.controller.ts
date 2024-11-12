import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from './helpers/image-file-filter.helper';
import { ImageExtension } from '../common/enums';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file', { fileFilter: imageFileFilter }))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    console.log({ fileInController: file });

    if (!file)
      throw new BadRequestException(
        `File must be a valid image (${Object.values(ImageExtension)})`,
      );

    return { filename: file.originalname };
  }
}
