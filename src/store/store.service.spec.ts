import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { Store } from './entities/store.entity';
import { StoreService } from './store.service';

const mockStore = {
  store: {
    name: 'boutiq-1',
    location: 'bp 121 abidjan 1258',
    city: 'abidjan',
    common: 'yopougon',
    email: 'tesqw@gmail.com',
    password: '$2a$10$IP3.7uEokPCximzhO13W4uxuNIwZDgltIqs6x/yHz7fN/kV0PVmFe',
    image: 'canada-wes_1674228620423-465306500.png',
    image_url:
      'http://localhost:3000/api/storeimages/canada-wes_1674228620423-465306500.png',
    telephone_number: '0197870345',
    deleteAt: null,
    createdAt: '2023-01-20T15:30:20.538Z',
    updatedAt: '2023-01-20T15:30:20.538Z',
    id: 'e0a926da-48a8-425d-9fb1-4e504b57306f',
    status: 1,
  },
  token: 'JwtToken',
};
const token = 'JwtToken';

let mockStoreRepository = {
  save: jest
    .fn()
    .mockImplementation((createStoreDto: CreateStoreDto) =>
      Promise.resolve(mockStore),
    ),
  find: jest.fn().mockResolvedValue([mockStore]),
};

describe('StoreService', () => {
  let service: StoreService;
  let storeRepository: Repository<Store>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        StoreService,
        {
          provide: getRepositoryToken(Store),
          useValue: mockStoreRepository,
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
