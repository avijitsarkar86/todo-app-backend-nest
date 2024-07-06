import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ValidateObjectId } from '../../pipes/validate-objectid.pipe';
import { UpdateTodoDto } from './dto/update-todo.dto';

@ApiTags('Todo')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodo: CreateTodoDto): Promise<Todo> {
    return this.todoService.create(createTodo);
  }

  @Get()
  findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id', ValidateObjectId) id: string): Promise<Todo> {
  //   return this.todoService.findOne(id);
  // }

  @Patch(':id')
  update(
    @Param('id', ValidateObjectId) id: string,
    @Body() updateTodo: UpdateTodoDto,
  ): Promise<any> {
    return this.todoService.update(id, updateTodo);
  }

  @Delete(':id')
  remove(@Param('id', ValidateObjectId) id: string): Promise<any> {
    return this.todoService.remove(id);
  }
}
