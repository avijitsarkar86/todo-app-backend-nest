import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockUserRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
};

const createUserDto: CreateUserDto = {
  username: 'testuser',
  password: 'password',
};

const mockUser: User = {
  id: '4110bd77-9f77-4ef6-9f2c-3f8d8e5cf992',
  username: 'test',
  password: expect.anything(),
  todos: [],
};

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should register an user', async () => {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(repository, 'create').mockReturnValue(mockUser);
      jest.spyOn(repository, 'save').mockResolvedValue(mockUser);

      // expect(await service.create(createUserDto)).toBe(result);
      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(repository.create).toHaveBeenCalledWith({
        username: createUserDto.username,
        password: hashedPassword,
      });

      expect(repository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw an error if username already exists', async () => {
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue({ code: 'ER_DUP_ENTRY' });

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOneByUsername', () => {
    it('should return a user by provided username', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);
      const result = await service.findOneByUsername(mockUser.username);
      expect(result).toBe(mockUser);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.findOneByUsername('something')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneById', () => {
    it('should return a user by provided ID', async () => {
      const id = '4110bd77-9f77-4ef6-9f2c-3f8d8e5cf992';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockUser);
      const result = await service.findOneById(id);
      expect(result).toBe(mockUser);
    });
  });
});
