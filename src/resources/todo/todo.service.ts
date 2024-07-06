import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(@InjectRepository(Todo) private todoRepo: Repository<Todo>) {}

  create(createTodo: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepo.create(createTodo);
    return this.todoRepo.save(todo);
  }

  findAll(): Promise<Todo[]> {
    return this.todoRepo.find();
  }

  // findOne(id: string): Promise<Todo> {
  //   return this.todoRepo.findOne(id);
  // }

  update(id: string, updateTodo: UpdateTodoDto): Promise<any> {
    return this.todoRepo.save({ ...updateTodo, id });
  }

  remove(id: string): Promise<any> {
    return this.todoRepo.delete(id);
  }
}
