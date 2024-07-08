import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IValidatedUser } from './interfaces/validated-user-res.interface';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  const mockUser = {
    id: '123',
    username: 'testuser',
    password: 'hashedpassword',
    todos: [],
  };

  const mockUserService = {
    findOneByUsername: jest.fn().mockReturnValue(mockUser),
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
});
