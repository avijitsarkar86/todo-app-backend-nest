import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
// import { Types, ObjectId } from 'mongoose';
// import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUser: CreateUserDto): Promise<User> {
    const { username, password } = createUser;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      username,
      password: hashedPassword,
    });

    try {
      return await this.userRepo.save(user);
    } catch (e) {
      // console.log('create :: e : ', e.code);
      if (e.code === 'ER_DUP_ENTRY') {
        // duplicate entry
        throw new ConflictException('username already registered');
      }
      throw e;
    }
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async findOneById(id: string) {
    try {
      return await this.userRepo.findOneBy({
        id,
      });
      // return ({ password, ...result } = result);
    } catch (e) {
      throw e;
    }
  }
}
