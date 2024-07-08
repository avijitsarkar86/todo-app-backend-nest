import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from '../user/entities/user.entity';

@ApiTags('Todo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodo: CreateTodoDto, @Request() req): Promise<Todo> {
    return this.todoService.create(createTodo, req.user as User);
  }

  @Get()
  findAll(@Request() req): Promise<Todo[]> {
    return this.todoService.findAll(req.user as User);
  }

  // // @Get(':id')
  // // findOne(@Param('id') id: string): Promise<Todo> {
  // //   return this.todoService.findOne(id);
  // // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodo: UpdateTodoDto,
    @Request() req,
  ): Promise<Todo> {
    return this.todoService.update(id, updateTodo, req.user as User);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req): Promise<any> {
    return this.todoService.remove(id, req.user as User);
  }
}
