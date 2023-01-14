import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Store } from '../store/entities/store.entity';

import { Repository } from 'typeorm';
import { CategorieService } from './categorie.service';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { Categorie } from './entities/categorie.entity';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { ForbiddenException } from '@nestjs/common';
import { Helper } from 'src/commons/shared/helpers';

describe('CategorieService', () => {
  let categoryservice: CategorieService;
  let categorieRepository: Repository<Categorie>;

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

  const mockCategorieRepository = {
    create: jest
      .fn()
      .mockImplementation((createCategorieDto: CreateCategorieDto) => {
        return { ...createCategorieDto };
      }),
    save: jest.fn().mockResolvedValue(() => Promise.resolve(mockCategorie)),
    findOne: jest
      .fn()
      .mockImplementation(() => Promise.resolve({ mockCategorie })),
    find: jest.fn().mockResolvedValue([mockCategorie]),
    findOneBy: jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCategorie)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategorieService,
        {
          provide: getRepositoryToken(Categorie),
          useValue: mockCategorieRepository,
        },
      ],
    }).compile();

    categoryservice = module.get<CategorieService>(CategorieService);
    categorieRepository = module.get(getRepositoryToken(Categorie));
  });

  it('should be defined', () => {
    expect(categoryservice).toBeDefined();
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

    const fakeCatgorie: Categorie = {
      id: 'azerty1',
      name: 'name123',
      status: 1,
      image_url:
        'htt//locp:alhost:3000/api/categorieimages/Capture d’écran 2023-01-10 161927_1673483345851-16467918.png',
      store_id: '2bce36d9-4dec-4818-ae59-ac5238bbad01',
      store: storeMock,
      image: '2023-01-10 161927_1673483345851-16467918.png',
      createdAt: new Date(),
      updatedAt: new Date(),
      deleteAt: new Date(),
      products: [],
    };

    it('Should create new Categorie', async () => {
      const categoryCreateSpy = jest
        .spyOn(categorieRepository, 'create')
        .mockReturnValue(fakeCatgorie);

      const findCategoryCategorieSpy = jest
        .spyOn(categorieRepository, 'findOne')
        .mockResolvedValue(fakeCatgorie);

      const categorieVerifyNameDoNoExistSpy = jest
        .spyOn(categoryservice, 'verifyNameDoesNoExist')
        .mockResolvedValue(true);

      const categorySaveSpy = jest
        .spyOn(categorieRepository, 'save')
        .mockResolvedValue(fakeCatgorie);

      const resultCategorie = await categoryservice.create(fakeCatgorie);

      expect(categoryCreateSpy).toBeCalledWith(newCategorieDto);
      expect(categorieVerifyNameDoNoExistSpy).toHaveBeenCalledWith(
        newCategorieDto.name,
      );
      expect(resultCategorie).toEqual(fakeCatgorie);
    });

    it('Should throw duplicate name entered', () => {
      jest
        .spyOn(categorieRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(fakeCatgorie));

      expect(
        categoryservice.verifyNameDoesNoExist(newCategorieDto.name),
      ).rejects.toThrow(ConflictException);
    });
  });

  it('Should find all categorie', async () => {
    const categoriesAllSpy = jest
      .spyOn(categorieRepository, 'find')
      .mockResolvedValue([mockCategorie]);

    const result = await categoryservice.findAll();
    expect(categoriesAllSpy).toHaveBeenCalled();
    expect(result).toEqual([mockCategorie]);
  });

  describe('findOne', () => {
    it('Should return One categorie', async () => {
      const findOneCategorySpy = jest
        .spyOn(categorieRepository, 'findOne')
        .mockResolvedValue(mockCategorie);

      const result = await categoryservice.findOne(mockCategorie.id);

      expect(result).toEqual(mockCategorie);
    });

    it('Should Throw Categorie  not found', async () => {
      const mockError = new NotFoundException('Categorie  not found');
      jest.spyOn(categorieRepository, 'findOne').mockRejectedValue(mockError);
    });
    expect(categoryservice.findOne(mockCategorie.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  describe('update', () => {
    const restaurant = { ...mockCategorie, name: 'updated name' };
    const updateCategorie = { name: 'updated name' };
    it('Should updated categorie', async () => {
      jest
        .spyOn(categoryservice, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(mockCategorie));

      jest.spyOn(categorieRepository, 'save').mockResolvedValueOnce(restaurant);

      const updatedCategorie = await categoryservice.update(
        mockCategorie.id,
        restaurant,
        restaurant.store_id,
      );
      expect(updatedCategorie.name).toEqual(updateCategorie.name);
    });

    it('Should Throw ForbiddenException updated categorie ', () => {
      jest
        .spyOn(categoryservice, 'findOne')
        .mockResolvedValueOnce(mockCategorie);

      expect(
        categoryservice.update(
          mockCategorie.id,
          restaurant,
          restaurant.store_id,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('Should remove Categorie', () => {
      jest
        .spyOn(categoryservice, 'findOne')
        .mockImplementation((id: string) => Promise.resolve(mockCategorie));

      jest.spyOn(Helper, 'deleteFile').mockResolvedValue(true);

      expect(
        categoryservice.remove(mockCategorie.id, mockCategorie.store_id),
      ).toEqual(mockCategorie);
    });
  });

  it('Should Throw remove Categorie', () => {
    jest
      .spyOn(categoryservice, 'findOne')
      .mockImplementation((id: string) => Promise.resolve(mockCategorie));

    expect(
      categoryservice.remove(mockCategorie.id, mockCategorie.store_id),
    ).rejects.toThrow(ForbiddenException);
  });

  it('getCategorieByStore', async () => {
    jest
      .spyOn(categorieRepository, 'find')
      .mockResolvedValueOnce([mockCategorie]);

    const result = await categoryservice.getCategorieByStore(
      mockCategorie.store_id,
    );
    expect(result).toEqual([mockCategorie]);
  });
  it('getImage', async () => {
    const findOneByCategorieSpy = jest
      .spyOn(categorieRepository, 'findOneBy')
      .mockResolvedValue(mockCategorie);
    const result = await categoryservice.getImage(mockCategorie.name);
    expect(result).toEqual(findOneByCategorieSpy);
  });
});
