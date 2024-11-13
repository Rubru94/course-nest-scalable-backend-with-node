import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageExtension } from '../common/enums';
import { diskStorage } from 'multer';
import { imageFileFilter, imageFileNamer } from './helpers';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
      // limits: { fileSize: 10000 }, // limit file size 10mb
      storage: diskStorage({
        destination: './static/products', // ./ --> it is project source path. If we use the public folder, anyone could access these files from outside.
        filename: imageFileNamer,
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    console.log({ fileInController: file });

    if (!file)
      throw new BadRequestException(
        `File must be a valid image (${Object.values(ImageExtension)})`,
      );

    return { filename: file.originalname };
  }
}
