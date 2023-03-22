import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import e from 'express';
import { Store } from 'src/store/entities/store.entity';
import { CategorieController } from './categorie.controller';
import { CategorieService } from './categorie.service';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';
const httpMocks = require('node-mocks-http');

describe('CategorieController', () => {
  let controller: CategorieController;
  let categorieService: CategorieService;
  let file: Express.Multer.File;
  let req: Request;

  const mockRequest = httpMocks.createRequest();

  const storeMock: Store = {
    createdAt: new Date(),
    updatedAt: new Date(),
    deleteAt: null,
    id: '44b88d3f-5eed-4629-b86b-c260bb16d8ab',
    name: 'boutique-1',
    location: 'bp 121 abidjan 1258',
    city: 'abidjan',
    common: 'yopougon',
    email: 'test@gmail.com',
    password: '$2a$10$ZzDsRRWhgZOg3qyHGgr7k.2fe3kX5dwHX0KI2GSLddbM9KQYUPFlS',
    status: 1,
    image: 'canada-wes_1673483077447-103868463.png',
    image_url:
      'http://localhost:3000/api/storeimages/canada-wes_1673483077447-103868463.png',
    telephone_number: '0187870342',
    categories: [],
  };

  const mockCategorie = {
    name: 'sperme de assia4',
    image: 'Capture d’écran 2023-01-10 161927_1673483345851-16467918.png',
    image_url:
      'htt//locp:alhost:3000/api/categorieimages/Capture d’écran 2023-01-10 161927_1673483345851-16467918.png',
    status: 1,
    store_id: '2bce36d9-4dec-4818-ae59-ac5238bbad01',
    // deleteAt: null,
    // createdAt: '2023-01-12T00:29:05.867Z',
    // updatedAt: '2023-01-12T00:29:05.867Z',
    createdAt: new Date(),
    updatedAt: new Date(),
    deleteAt: new Date(),
    id: '8eb0b9aa-2c4f-4555-be27-790bec2663fa',
    products: [],
    store: storeMock,
  };

  const MockUrlImageCategorie =
    'http://localhost:3000/api/categorieimages/Capture d’écran 2023-01-10 161927_1673483345851-16467918.png';

  const mockCategorieService = {
    create: jest
      .fn()
      .mockImplementation((createCategorieDto: CreateCategorieDto) =>
        Promise.resolve(mockCategorie),
      ),
    findAll: jest.fn().mockResolvedValue([mockCategorie]),
    findOne: jest
      .fn()
      .mockImplementation((id: string) => Promise.resolve(mockCategorie)),
    verifyNameDoesNoExist: jest.fn().mockResolvedValueOnce(true),
    update: jest
      .fn()
      .mockImplementationOnce(
        (id: string, updateCategorieDto: UpdateCategorieDto, storeId: string) =>
          Promise.resolve(mockCategorie),
      ),

    remove: jest
      .fn()
      .mockImplementationOnce((id: string, storeId: string) =>
        Promise.resolve(true),
      ),
    getCategorieByStore: jest
      .fn()
      .mockImplementationOnce((store_id: string) =>
        Promise.resolve([mockCategorie]),
      ),

    getCategorieCurrentStore: jest
      .fn()
      .mockImplementationOnce((store_id: string) =>
        Promise.resolve(mockCategorie),
      ),
    getImage: jest
      .fn()
      .mockResolvedValueOnce((name: string) => Promise.resolve(mockCategorie)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: 'secret-generate-eam',
          signOptions: { expiresIn: '60m' },
        }),
        MulterModule.register({
          dest: './uploads',
        }),
      ],
      controllers: [CategorieController],
      providers: [
        {
          provide: CategorieService,
          useValue: mockCategorieService,
        },
      ],
    }).compile();

    controller = module.get<CategorieController>(CategorieController);
    categorieService = module.get<CategorieService>(CategorieService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const newCategorieDto: CreateCategorieDto = {
      name: 'name123',
      status: 1,
      image_url:
        'htt//locp:alhost:3000/api/categorieimages/Capture d’écran 2023-01-10 161927_1673483345851-16467918.png',
      image: '2023-01-10 161927_1673483345851-16467918.png',
      store_id: '2bce36d9-4dec-4818-ae59-ac5238bbad01',
    };

    file = {
      originalname: 'test.jpg',
      fieldname: 'test.jpg',
      mimetype: 'jpg',
      filename: 'test.jpg',
      encoding: 'utf-8',
      destination: './uploads',
      buffer: new Buffer(''),
      path: './url',
      size: 35,
      stream: null,
    };

    it('Should new Create  categorie', async () => {
      const categorieSpy = jest
        .spyOn(categorieService, 'create')
        .mockImplementation((newCategorieDto: CreateCategorieDto) =>
          Promise.resolve(mockCategorie),
        );

      const result = await controller.create(
        newCategorieDto,
        file,
        mockRequest,
      );
      expect(categorieService.create).toHaveBeenCalled();
      expect(result).toEqual(categorieSpy);
    });
  });
  it('Should return All Categories', async () => {
    const findCategorieAllSpies = jest
      .spyOn(categorieService, 'findAll')
      .mockResolvedValue([mockCategorie]);

    expect(await categorieService.findAll()).toEqual(findCategorieAllSpies);
  });

  it('Should return current Store of categorie', async () => {
    const categoryCuurentStoreSpy = jest
      .spyOn(categorieService, 'getCategorieCurrentStore')
      .mockResolvedValue([mockCategorie]);

    expect(categorieService.getCategorieCurrentStore).toHaveBeenCalled();
    expect(await controller.categoryCuurentStore(storeMock.id)).toEqual([
      mockCategorie,
    ]);
  });

  it('Should return find one categorie', async () => {
    const findOneCategorySpy = jest
      .spyOn(categorieService, 'findOne')
      .mockImplementation((id: string) => Promise.resolve(mockCategorie));

    expect(categorieService.findOne).toHaveBeenCalled();
    expect(await controller.findOne(mockCategorie.id)).toEqual(
      findOneCategorySpy,
    );
  });

  it('Should return url image categorie', async () => {
    const urlImageCategorieSpy = jest
      .spyOn(categorieService, 'getImage')
      .mockImplementationOnce(() => Promise.resolve(mockCategorie));

    const result = await controller.getImage(mockCategorie.image, mockRequest);

    expect(categorieService.getImage).toHaveBeenCalled();
    expect(result).toEqual(urlImageCategorieSpy);
  });

  it('Should return category By Store', async () => {
    const categoryByStoreSpy = jest
      .spyOn(categorieService, 'getCategorieByStore')
      .mockResolvedValue([mockCategorie]);
    expect(categorieService.getCategorieByStore).toHaveBeenCalled();
    expect(await controller.categoryByStore(mockCategorie.store_id)).toEqual(
      categoryByStoreSpy,
    );
  });

  it('Should update category', async () => {
    const updateCategorie: UpdateCategorieDto = { ...mockCategorie };
    const updatedCategoryName = { name: 'new Name', ...updateCategorie };
    const upatedCategorySpy = jest
      .spyOn(categorieService, 'update')
      .mockResolvedValue(mockCategorie);

    const result = await controller.update(
      mockCategorie.id,
      updatedCategoryName,
      file,
      mockRequest,
      storeMock,
    );
    expect(categorieService.update).toHaveBeenCalled();
    expect(result.name).toBe(updatedCategoryName.name);
  });

  it('Should delete category', async () => {
    const deleteCategorySpy = jest
      .spyOn(categorieService, 'remove')
      .mockResolvedValue(mockCategorie);

    expect(categorieService.remove).toHaveBeenCalled();
    expect(await controller.remove(mockCategorie.id, storeMock)).toEqual(
      mockCategorie,
    );
  });
});
