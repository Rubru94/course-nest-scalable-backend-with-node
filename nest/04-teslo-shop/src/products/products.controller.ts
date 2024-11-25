import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ValidRole } from '../auth/enums/valid-role.enum';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateProductDto, PlainProductDto, UpdateProductDto } from './dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
// @Auth(ValidRole.User) // Custom decorator can be used for all endpoints if placed at controller level.
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiResponse({
    status: 201,
    description: 'Product created',
    type: PlainProductDto,
  })
  @ApiResponse({
    example: {
      message: 'Key (title)=(Example shirt 11) already exists.',
      error: 'Bad Request',
      statusCode: 400,
    },
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
    status: 401,
    description: 'Unauthorized',
  })
  // @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiBearerAuth()
  @Post()
  @Auth(ValidRole.Admin)
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ): Promise<PlainProductDto> {
    return this.productsService.create(createProductDto, user);
  }

  @ApiResponse({
    status: 200,
    description: 'Products found',
    type: [PlainProductDto],
  })
  @Get()
  findAll(@Query() paginationDto: PaginationDto): Promise<PlainProductDto[]> {
    return this.productsService.findAll(paginationDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Product found',
    type: PlainProductDto,
  })
  @ApiResponse({
    example: {
      message: 'Not found product with term(id, title or slug): foo',
      error: 'Not Found',
      statusCode: 404,
    },
    status: 404,
    description: 'Not Found',
  })
  @Get(':term')
  findOne(@Param('term') term: string): Promise<PlainProductDto> {
    return this.productsService.findOnePlain(term);
  }

  @ApiResponse({
    status: 200,
    description: 'Updated product',
    type: PlainProductDto,
  })
  @ApiResponse({
    example: {
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
      statusCode: 400,
    },
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    example: {
      message:
        'Not found product with term(id, title or slug): dca8ac01-4172-4d2d-b920-2ff41863f3b9',
      error: 'Not Found',
      statusCode: 404,
    },
    status: 404,
    description: 'Not Found',
  })
  @ApiBearerAuth()
  @Patch(':id')
  @Auth(ValidRole.Admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ): Promise<PlainProductDto> {
    return this.productsService.update(id, updateProductDto, user);
  }

  @ApiResponse({
    status: 200,
    description: 'Deleted product',
    type: PlainProductDto,
  })
  @ApiResponse({
    example: {
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
      statusCode: 400,
    },
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    example: {
      message:
        'Not found product with term(id, title or slug): dca8ac01-4172-4d2d-b920-2ff41863f3b9',
      error: 'Not Found',
      statusCode: 404,
    },
    status: 404,
    description: 'Not Found',
  })
  @ApiBearerAuth()
  @Delete(':id')
  @Auth(ValidRole.Admin)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<PlainProductDto> {
    return this.productsService.remove(id);
  }
}
