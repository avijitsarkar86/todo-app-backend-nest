import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

const mockUserRepo = {
  create: jest.fn(),
  save: jest.fn(),
};

const createUserDto: CreateUserDto = {
  username: 'testuser',
  password: 'password',
};

const mockUser: User = {
  id: new Types.ObjectId(),
  username: 'test',
  password: expect.anything(),
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
      jest.spyOn(repository, 'save').mockRejectedValue({ code: 11000 });

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
