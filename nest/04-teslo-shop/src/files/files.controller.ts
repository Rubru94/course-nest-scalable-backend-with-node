import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { ImageExtension } from '../common/enums';
import { FilesService } from './files.service';
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

    const secureUrl = `${file.filename}`;

    return { secureUrl };
  }

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response, // Handle response with express way. This causes certain steps in nestjs lifecycle to be skipped (e.g. interceptors).
    @Param('imageName') imageName: string,
  ) {
    res.status(200).sendFile(this.filesService.findProductImagePath(imageName));
  }
}
