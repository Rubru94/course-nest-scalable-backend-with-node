import { Logger, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  DataSource,
  In,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { ValidRole } from '../auth/enums/valid-role.enum';
import * as ErrorHandler from '../common/handlers/error.handler';
import { CreateProductDto, PlainProductDto } from './dto';
import { Product, ProductImage } from './entities';
import { ProductsService } from './products.service';

jest.mock('../common/handlers/error.handler', () => ({
  handleDBException: jest.fn(),
}));

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;
  let productImageRepository: Repository<ProductImage>;
  let dataSource: DataSource;
  let logger: Logger;

  const mockCreateQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    delete: jest.fn(),
  } as unknown as SelectQueryBuilder<Product>;

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: { save: jest.fn(), delete: jest.fn() },
    }),
  };

  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useClass: Repository },
        { provide: getRepositoryToken(ProductImage), useClass: Repository },
        { provide: DataSource, useValue: mockDataSource },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    productImageRepository = module.get<Repository<ProductImage>>(
      getRepositoryToken(ProductImage),
    );
    dataSource = module.get<DataSource>(DataSource);
    logger = module.get<Logger>(Logger);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createProductDto: CreateProductDto = {
      title: 'Example shirt 11',
      sizes: ['SM', 'M', 'L'],
      gender: 'male',
      images: ['http://image1.jpg', 'http://image2.jpg'],
    };
    const user = {
      id: '321d1565-09d6-441f-b2d0-3c430670b760',
      email: 'john.Doe@mail.com',
      fullName: 'John Doe',
    } as User;
    const mockProduct = ({
      images = [],
      ...productDetails
    }: CreateProductDto) =>
      ({
        id: '1',
        ...productDetails,
        user,
        images: images.map((url) => ({ url }) as ProductImage),
      }) as Product;

    it('should create product with images', async () => {
      const product = mockProduct(createProductDto);

      const mockCreateProduct = jest
        .spyOn(productRepository, 'create')
        .mockReturnValue(product);
      const mockSaveProduct = jest
        .spyOn(productRepository, 'save')
        .mockResolvedValueOnce(product);
      jest
        .spyOn(productImageRepository, 'create')
        .mockImplementation((productImage) => productImage as ProductImage);

      const result = await service.create(createProductDto, user);

      expect(mockCreateProduct).toHaveBeenCalledWith({
        ...createProductDto,
        user,
        images: product.images,
      });
      expect(mockSaveProduct).toHaveBeenCalledWith(product);
      expect(result).toEqual(new PlainProductDto(product));
    });

    it('should create product without images', async () => {
      delete createProductDto.images;
      const product = mockProduct(createProductDto);

      jest.spyOn(productRepository, 'create').mockReturnValue(product);
      jest.spyOn(productRepository, 'save').mockResolvedValueOnce(product);

      const result = await service.create(createProductDto, user);

      expect(productRepository.create).toHaveBeenCalledWith({
        ...createProductDto,
        user,
        images: product.images,
      });
      expect(productRepository.save).toHaveBeenCalledWith(product);
      expect(result).toEqual(new PlainProductDto(product));
    });

    it('should handle database exception', async () => {
      const error = new Error('Test error');

      jest.spyOn(productRepository, 'save').mockImplementation(() => {
        throw error;
      });
      const mockHandleDBException = jest.spyOn(
        ErrorHandler,
        'handleDBException',
      );

      try {
        await service.create(createProductDto, user);
      } catch (error) {
        expect(mockHandleDBException).toHaveBeenCalledWith(error, logger);
        expect(error.message).toBe('Test error');
      }
    });
  });

  describe('createBatch', () => {
    const createProductDtoCollection = [
      { name: 'Product 1', images: ['image1.jpg'] },
      { name: 'Product 2', images: ['image2.jpg'] },
    ] as unknown as CreateProductDto[];
    const users = [
      {
        email: 'test1@mail.com',
        password: 'Abc123',
        fullName: 'Test One',
        roles: [ValidRole.Admin, ValidRole.User],
      },
    ] as User[];
    const savedProducts = [
      { id: 1, name: 'Product 1' },
      { id: 2, name: 'Product 2' },
    ];

    it('should create products', async () => {
      jest
        .spyOn(productImageRepository, 'create')
        .mockImplementation((data) => data as ProductImage);
      jest
        .spyOn(productRepository, 'create')
        .mockImplementation((data) => data as Product);
      jest
        .spyOn(productRepository, 'save')
        .mockResolvedValue(savedProducts as any);

      const result = await service.createBatch(
        createProductDtoCollection,
        users,
      );

      expect(productRepository.create).toHaveBeenCalledTimes(2);
      expect(productRepository.create).toHaveBeenCalledWith({
        name: 'Product 1',
        user: users[0],
        images: [{ url: 'image1.jpg' }],
      });
      expect(productRepository.create).toHaveBeenCalledWith({
        name: 'Product 2',
        user: users[0],
        images: [{ url: 'image2.jpg' }],
      });
      expect(productRepository.save).toHaveBeenCalledWith([
        { name: 'Product 1', user: users[0], images: [{ url: 'image1.jpg' }] },
        { name: 'Product 2', user: users[0], images: [{ url: 'image2.jpg' }] },
      ]);
      expect(result).toEqual(savedProducts);
    });

    it('should handle database exception', async () => {
      const error = new Error('Test error');

      jest.spyOn(productRepository, 'save').mockImplementation(() => {
        throw error;
      });
      const mockHandleDBException = jest.spyOn(
        ErrorHandler,
        'handleDBException',
      );

      try {
        await service.createBatch(createProductDtoCollection, users);
      } catch (error) {
        expect(mockHandleDBException).toHaveBeenCalledWith(error, logger);
        expect(error.message).toBe('Test error');
      }
    });
  });

  describe('findAll', () => {
    let spyFind: jest.SpyInstance<Promise<Product[]>>;
    const products = [
      {
        id: '1',
        title: 'Example shirt 11',
        sizes: ['SM', 'M', 'L'],
        gender: 'male',
        user: {
          id: '321d1565-09d6-441f-b2d0-3c430670b761',
          email: 'test2@mail.com',
          fullName: 'Test Two',
          isActive: true,
          roles: ['admin', 'user'],
        },
        images: [],
      },
      {
        id: '2',
        title: 'Example shirt 12',
        sizes: ['SM', 'M', 'L'],
        gender: 'female',
        user: {
          id: '321d1565-09d6-441f-b2d0-3c430670b761',
          email: 'test2@mail.com',
          fullName: 'Test Two',
          isActive: true,
          roles: ['admin', 'user'],
        },
        images: [],
      },
    ] as Product[];

    beforeEach(() => {
      spyFind = jest
        .spyOn(productRepository, 'find')
        .mockResolvedValueOnce(products);
    });

    it('should return array of products with custom pagination', async () => {
      const paginationDto = { limit: 5, offset: 2 };

      const result = await service.findAll(paginationDto);

      expect(spyFind).toHaveBeenCalledWith({
        take: paginationDto.limit,
        skip: paginationDto.offset,
        relations: {
          images: true,
        },
      });
      expect(result).toEqual(
        products.map((product) => new PlainProductDto(product)),
      );
    });

    it('should return array of products with default pagination', async () => {
      const defaultPaginationDto = { limit: 10, offset: 0 };

      const result = await service.findAll({});

      expect(spyFind).toHaveBeenCalledWith({
        take: defaultPaginationDto.limit,
        skip: defaultPaginationDto.offset,
        relations: {
          images: true,
        },
      });
      expect(result).toEqual(
        products.map((product) => new PlainProductDto(product)),
      );
    });
  });

  describe('findOne', () => {
    const product = {
      id: '13f13da0-2f1c-4d7a-a1af-4baa8e69759a',
      title: 'Example shirt 11',
      sizes: ['SM', 'M', 'L'],
      gender: 'male',
      user: {
        id: '321d1565-09d6-441f-b2d0-3c430670b761',
        email: 'test2@mail.com',
        fullName: 'Test Two',
        isActive: true,
        roles: ['admin', 'user'],
      },
      images: [],
    } as Product;

    it('should return one single product searching uuid as term', async () => {
      const productId = '13f13da0-2f1c-4d7a-a1af-4baa8e69759a';
      const spyFindOneById = jest
        .spyOn(productRepository, 'findOneBy')
        .mockResolvedValue(product);

      const result = await service.findOne(productId);

      expect(spyFindOneById).toHaveBeenCalledWith({ id: productId });
      expect(result).toEqual(product);
    });

    it('should return one single product searching title or slug as term', async () => {
      const term = 'example_shirt_11';
      const qbAlias = 'prod';
      const spyCreateQueryBuilder = jest
        .spyOn(productRepository, 'createQueryBuilder')
        .mockReturnValue(mockCreateQueryBuilder);
      const qb = productRepository.createQueryBuilder();
      jest.spyOn(qb, 'getOne').mockResolvedValue(product);

      const result = await service.findOne(term);

      expect(spyCreateQueryBuilder).toHaveBeenCalledWith(qbAlias);
      expect(qb.where).toHaveBeenCalledWith(
        'UPPER(title)=:title or slug=:slug',
        { title: term.toUpperCase(), slug: term },
      );
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
        `${qbAlias}.images`,
        'prodImages',
      );
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
        `${qbAlias}.user`,
        'prodUser',
      );
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException if product is not found', async () => {
      const term = 'test';
      jest
        .spyOn(productRepository, 'createQueryBuilder')
        .mockReturnValue(mockCreateQueryBuilder);
      const qb = productRepository.createQueryBuilder();
      jest.spyOn(qb, 'getOne').mockResolvedValue(null);

      let result;
      try {
        result = await service.findOne(term);
      } catch (error) {
        result = error;
      }
      expect(result).toEqual(
        new NotFoundException(
          `Not found product with term(id, title or slug): ${term}`,
        ),
      );
      expect(result).toBeInstanceOf(NotFoundException);
      expect(result.message).toBe(
        `Not found product with term(id, title or slug): ${term}`,
      );

      /**
       * act & assert at once alternative
       */
      /* await expect(service.findOne(term)).rejects.toThrow(
        new NotFoundException(
          `Not found product with term(id, title or slug): ${term}`,
        ),
      ); */
    });
  });

  it('findOnePlain should return a plain product', async () => {
    const term = 'example_shirt_11';
    const product = {
      id: '13f13da0-2f1c-4d7a-a1af-4baa8e69759a',
      title: 'Example shirt 11',
      sizes: ['SM', 'M', 'L'],
      gender: 'male',
      user: {
        id: '321d1565-09d6-441f-b2d0-3c430670b761',
        email: 'test2@mail.com',
        fullName: 'Test Two',
        isActive: true,
        roles: ['admin', 'user'],
      },
      images: [
        { id: 1, url: 'http://image1.jpg' },
        { id: 2, url: 'http://image2.jpg' },
      ],
    } as Product;
    const plainProduct = new PlainProductDto(product);

    const spyFindOne = jest
      .spyOn(service, 'findOne')
      .mockResolvedValueOnce(product);

    const result = await service.findOnePlain(term);

    expect(spyFindOne).toHaveBeenCalledWith(term);
    expect(result).toEqual(plainProduct);
  });

  describe('update', () => {
    let spyImagesFindBy: jest.SpyInstance;
    let spyProductPreload: jest.SpyInstance;
    let qr: QueryRunner;

    const product = {
      id: '13f13da0-2f1c-4d7a-a1af-4baa8e69759a',
      title: 'Example shirt 11',
      sizes: ['SM', 'M', 'L'],
      gender: 'male',
      user: {
        id: '321d1565-09d6-441f-b2d0-3c430670b761',
        email: 'test2@mail.com',
        fullName: 'Test Two',
        isActive: true,
        roles: ['admin', 'user'],
      },
      images: [
        { id: 1, url: 'http://image1.jpg' },
        { id: 2, url: 'http://image2.jpg' },
      ],
    } as Product;
    const updateProductDto = {
      sizes: ['SM', 'M', 'L', 'XXL'],
      gender: 'male',
      price: 15.95,
      images: ['http://imageNew1.jpg', 'http://imageNew4.jpg'],
    };
    const user = {
      id: '321d1565-09d6-441f-b2d0-3c430670b761',
      email: 'test2@mail.com',
      fullName: 'Test Two',
      isActive: true,
      roles: ['admin', 'user'],
    } as User;
    const { images, ...restUpdateProductDto } = updateProductDto;

    beforeEach(() => {
      spyImagesFindBy = jest.spyOn(productImageRepository, 'findBy');
      jest
        .spyOn(productImageRepository, 'create')
        .mockImplementation((productImage) => productImage as ProductImage);
      spyProductPreload = jest.spyOn(productRepository, 'preload');
      jest
        .spyOn(service, 'findOnePlain')
        .mockResolvedValueOnce(new PlainProductDto(product));
      qr = dataSource.createQueryRunner();
    });

    it('should return updated product when product to update does not have images', async () => {
      spyImagesFindBy.mockResolvedValueOnce(product.images);
      spyProductPreload.mockResolvedValueOnce(product);

      const result = await service.update(
        product.id,
        restUpdateProductDto,
        user,
      );

      expect(spyImagesFindBy).toHaveBeenCalledWith({
        product: { id: product.id },
      });
      expect(spyProductPreload).toHaveBeenCalledWith({
        id: product.id,
        ...restUpdateProductDto,
      });
      expect(qr.connect).toHaveBeenCalled();
      expect(qr.startTransaction).toHaveBeenCalled();
      expect(product.user).toEqual(user);
      expect(qr.manager.save).toHaveBeenCalledWith(product);
      expect(qr.commitTransaction).toHaveBeenCalled();
      expect(qr.release).toHaveBeenCalled();
      expect(result).toEqual(new PlainProductDto(product));
    });

    describe('Product to update with images', () => {
      it('should return updated product', async () => {
        spyImagesFindBy.mockResolvedValueOnce(product.images);
        spyProductPreload.mockResolvedValueOnce(product);

        const urlsToDelete = product.images
          .map(({ url }) => url)
          .filter((url) => !images.includes(url));

        await service.update(product.id, updateProductDto, user);

        expect(qr.manager.delete).toHaveBeenCalledWith(ProductImage, {
          product: { id: product.id },
          url: In(urlsToDelete),
        });
      });

      it('should handle database exception', async () => {
        const error = new Error('Test error');

        spyImagesFindBy.mockResolvedValueOnce(product.images);
        spyProductPreload.mockResolvedValueOnce(product);
        jest.spyOn(productImageRepository, 'create').mockImplementation(() => {
          throw error;
        });
        const mockHandleDBException = jest.spyOn(
          ErrorHandler,
          'handleDBException',
        );

        try {
          await service.update(product.id, updateProductDto, user);
        } catch (error) {
          expect(qr.rollbackTransaction).toHaveBeenCalled();
          expect(qr.release).toHaveBeenCalled();
          expect(mockHandleDBException).toHaveBeenCalledWith(error, logger);
          expect(error.message).toBe('Test error');
        }
      });
    });

    it('should throw NotFoundException if product is not found', async () => {
      spyImagesFindBy.mockResolvedValueOnce(product.images);
      spyProductPreload.mockResolvedValueOnce(null);

      let result;
      try {
        result = await service.update(product.id, updateProductDto, user);
      } catch (error) {
        result = error;
      }

      expect(spyImagesFindBy).toHaveBeenCalledWith({
        product: { id: product.id },
      });
      expect(spyProductPreload).toHaveBeenCalledWith({
        id: product.id,
        ...restUpdateProductDto,
      });
      expect(result).toBeInstanceOf(NotFoundException);
      expect(result.message).toBe(`Not found product with id: ${product.id}`);
    });
  });

  it('should remove product and return it', async () => {
    const product = {
      id: '13f13da0-2f1c-4d7a-a1af-4baa8e69759a',
      title: 'Example shirt 11',
      sizes: ['SM', 'M', 'L'],
      gender: 'male',
      user: {
        id: '321d1565-09d6-441f-b2d0-3c430670b761',
        email: 'test2@mail.com',
        fullName: 'Test Two',
        isActive: true,
        roles: ['admin', 'user'],
      },
      images: [
        { id: 1, url: 'http://image1.jpg' },
        { id: 2, url: 'http://image2.jpg' },
      ],
    } as Product;

    const spyFindOne = jest
      .spyOn(service, 'findOne')
      .mockResolvedValueOnce(product);
    const spyRemove = jest
      .spyOn(productRepository, 'remove')
      .mockResolvedValueOnce(product);

    const result = await service.remove(product.id);

    expect(spyFindOne).toHaveBeenCalledWith(product.id);
    expect(spyRemove).toHaveBeenCalledWith(product);
    expect(result).toEqual(new PlainProductDto(product));
  });

  describe('deleteAllProducts', () => {
    let spyCreateQueryBuilder: jest.SpyInstance;
    let qb: SelectQueryBuilder<Product>;

    beforeEach(() => {
      spyCreateQueryBuilder = jest
        .spyOn(productRepository, 'createQueryBuilder')
        .mockReturnValue(mockCreateQueryBuilder);
      qb = productRepository.createQueryBuilder();
    });

    it('should remove all products', async () => {
      await service.deleteAllProducts();

      expect(spyCreateQueryBuilder).toHaveBeenCalledWith('product');
      expect(qb.delete).toHaveBeenCalled();
    });

    it('should handle database exception', async () => {
      const error = new Error('Test error');

      jest.spyOn(qb, 'delete').mockImplementation(() => {
        throw error;
      });
      const mockHandleDBException = jest.spyOn(
        ErrorHandler,
        'handleDBException',
      );

      try {
        await service.deleteAllProducts();
      } catch (error) {
        expect(mockHandleDBException).toHaveBeenCalledWith(error, logger);
        expect(error.message).toBe('Test error');
      }
    });
  });
});
