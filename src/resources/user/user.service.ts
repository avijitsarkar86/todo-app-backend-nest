import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

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
      console.log('e : ', e.code);
      if (e.code === 11000) {
        // duplicate entry
        throw new ConflictException('username already registered');
      }
      throw e;
    }
  }
}
