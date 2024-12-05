import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../auth/entities/user.entity';
import { CreateProductDto, PlainProductDto, UpdateProductDto } from './dto';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn().mockResolvedValueOnce({} as PlainProductDto),
    findAll: jest.fn().mockResolvedValueOnce([] as PlainProductDto[]),
    findOnePlain: jest.fn().mockResolvedValueOnce({} as PlainProductDto),
    update: jest.fn().mockResolvedValueOnce({} as PlainProductDto),
    remove: jest.fn().mockResolvedValueOnce({} as PlainProductDto),
  };

  const user = {
    id: '321d1565-09d6-441f-b2d0-3c430670b761',
    email: 'test2@mail.com',
    fullName: 'Test Two',
    isActive: true,
    roles: ['admin', 'user'],
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: mockProductsService }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', async () => {
    const createProductDto = {} as CreateProductDto;

    const result = await controller.create(createProductDto, user);

    expect(result).toEqual({} as PlainProductDto);
    expect(service.create).toHaveBeenCalledWith(createProductDto, user);
  });

  it('should return an array of products with findAll', async () => {
    const paginationDto = { limit: 10, offset: 0 };

    const result = await controller.findAll(paginationDto);

    expect(result).toEqual([] as PlainProductDto[]);
    expect(service.findAll).toHaveBeenCalledWith(paginationDto);
  });

  it('should return a product with findOne', async () => {
    const term = 'term';

    const result = await controller.findOne(term);

    expect(result).toEqual({} as PlainProductDto);
    expect(service.findOnePlain).toHaveBeenCalledWith(term);
  });

  it('should update a product', async () => {
    const updateProductDto = {} as UpdateProductDto;
    const id = '1';

    const result = await controller.update(id, updateProductDto, user);

    expect(result).toEqual({} as PlainProductDto);
    expect(service.update).toHaveBeenCalledWith(id, updateProductDto, user);
  });

  it('should remove a product', async () => {
    const id = '1';

    const result = await controller.remove(id);

    expect(result).toEqual({} as PlainProductDto);
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
