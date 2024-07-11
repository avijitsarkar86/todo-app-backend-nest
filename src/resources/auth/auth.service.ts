import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { IValidatedUser } from './interfaces/validated-user-res.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<IValidatedUser | null> {
    const user = await this.userService.findOneByUsername(username);

    if (user && bcrypt.compareSync(pass, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, todos, ...result } = user;
      // console.log('password : ', password, 'result : ', result);
      return result;
    }

    return null;
  }

  async login(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.validateUser(username, pass);
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUser: CreateUserDto): Promise<{ access_token: string }> {
    const { username, password } = createUser;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.create({
      username,
      password: hashedPassword,
    });

    // try {
    //   return await this.userRepo.save(user);
    // } catch (e) {
    //   // console.log('create :: e : ', e.code);
    //   if (e.code === 'ER_DUP_ENTRY') {
    //     // duplicate entry
    //     throw new ConflictException('username already registered');
    //   }
    //   throw e;
    // }
    if (!user) {
      throw new BadRequestException();
    }

    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
