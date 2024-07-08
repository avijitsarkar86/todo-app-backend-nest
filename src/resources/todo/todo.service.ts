import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(@InjectRepository(Todo) private todoRepo: Repository<Todo>) {}

  async create(createTodo: CreateTodoDto, user: User): Promise<Todo> {
    const todo = this.todoRepo.create({ ...createTodo, user });
    return this.todoRepo.save(todo);
  }

  findAll(user: User): Promise<Todo[]> {
    return this.todoRepo.find({ where: { user } });
  }

  // findOne(id: string): Promise<Todo> {
  //   return this.todoRepo.findOne(id);
  // }

  async update(
    id: string,
    updateTodo: UpdateTodoDto,
    user: User,
  ): Promise<Todo> {
    const todo = await this.todoRepo.findOne({
      where: {
        user,
        id,
      },
    });
    if (!todo) {
      throw new NotFoundException('invalid todo id');
    }
    return this.todoRepo.save({ ...updateTodo, id });
  }

  async remove(id: string, user: User): Promise<any> {
    const todo = await this.todoRepo.findOne({
      where: {
        user,
        id,
      },
    });
    if (!todo) {
      throw new NotFoundException('invalid todo id');
    }
    return this.todoRepo.delete(todo.id);
  }
}
