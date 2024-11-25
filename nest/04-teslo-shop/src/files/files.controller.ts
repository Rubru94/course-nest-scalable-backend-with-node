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
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { Auth } from '../auth/decorators';
import { ValidRole } from '../auth/enums/valid-role.enum';
import { ImageExtension } from '../common/enums';
import { FileUploadDto, UploadedImageDto } from './dtos';
import { FilesService } from './files.service';
import { imageFileFilter, imageFileNamer } from './helpers';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly configService: ConfigService,
    private readonly filesService: FilesService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Image uploaded',
    type: UploadedImageDto,
  })
  @ApiResponse({
    example: {
      message: 'File must be a valid image (jpg,jpeg,png,svg,gif)',
      error: 'Bad Request',
      statusCode: 400,
    },
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
    status: 401,
    description: 'Unauthorized',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file',
    type: FileUploadDto,
  })
  @ApiBearerAuth()
  @Post('product')
  @Auth(ValidRole.Admin)
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
  uploadProductImage(
    @UploadedFile()
    file: Express.Multer.File,
  ): UploadedImageDto {
    // console.log({ fileInController: file });

    if (!file)
      throw new BadRequestException(
        `File must be a valid image (${Object.values(ImageExtension)})`,
      );

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return { secureUrl };
  }

  @ApiResponse({
    status: 200,
    description: 'Image found',
  })
  @ApiResponse({
    example: {
      message: 'Product image 1473809-00-A_1_2000_0.jpg not found',
      error: 'Not Found',
      statusCode: 404,
    },
    status: 404,
    description: 'Not Found',
  })
  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response, // Handle response with express way. This causes certain steps in nestjs lifecycle to be skipped (e.g. interceptors).
    @Param('imageName') imageName: string,
  ): void {
    res.status(200).sendFile(this.filesService.findProductImagePath(imageName));
  }
}
