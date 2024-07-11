import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IValidatedUser } from './interfaces/validated-user-res.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  const mockUser: User = {
    id: '4110bd77-9f77-4ef6-9f2c-3f8d8e5cf992',
    username: 'test',
    password: 'hanshedpassword',
    todos: [],
  };

  const mockUserService = {
    findOneByUsername: jest.fn().mockReturnValue(mockUser),
    create: jest.fn(),
  };

  const validateUserRes: IValidatedUser = {
    id: mockUser.id,
    username: mockUser.username,
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('signedtoken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user result if password matched', async () => {
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      jest.spyOn(userService, 'findOneByUsername').mockResolvedValue(mockUser);

      const result = await authService.validateUser('testuser', 'password');
      // console.log('validateUser :: result: ', result);

      expect(result.id.toString()).toEqual(validateUserRes.id.toString());
    });

    it('should return "null" if password does not matched', async () => {
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
      jest.spyOn(userService, 'findOneByUsername').mockResolvedValue(mockUser);

      const result = await authService.validateUser('testuser', 'invalid-pass');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return payload with access_token', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

      const result = await authService.login('testuser', 'pass');
      // console.log('login :: result : ', result);
      expect(result).toEqual({ access_token: 'signedtoken' });
    });

    it('should throw unauthorized exception when there is no user', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);
      await expect(
        authService.login('invalid-user', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw unauthorized exception when password does not match', async () => {
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
      await expect(
        authService.login('testuser', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      password: 'password',
    };

    it('should register an user', async () => {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);

      // expect(await service.create(createUserDto)).toBe(result);
      const result = await authService.register(createUserDto);

      expect(result).toEqual({ access_token: 'signedtoken' });
    });
  });
});
