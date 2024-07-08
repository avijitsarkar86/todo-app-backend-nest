import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo, TodoStatus } from './entities/todo.entity';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const mockTodoService = {
  findAll: jest.fn(),
  // findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockUser: User = {
  id: '4110bd77-9f77-4ef6-9f2c-3f8d8e5cf992',
  username: 'testuser',
  password: 'hashedpassword',
  todos: [],
};

const mockTodo: Todo = {
  id: '456',
  title: 'Test todo',
  description: 'test desc',
  user: mockUser,
  status: TodoStatus.PENDING,
  created_at: new Date(),
  updated_at: new Date(),
};

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('JwtAuthGuard', () => {
    let guard: JwtAuthGuard;
    let context: ExecutionContext;

    beforeEach(() => {
      guard = new JwtAuthGuard(new Reflector());
      context = {
        switchToHttp: () => ({
          getRequest: () => ({ headers: { authorization: 'Bearer Token' } }),
        }),
      } as unknown as ExecutionContext;
    });

    it('should allow access when there is a valid JWT token', async () => {
      jest.spyOn(guard, 'canActivate').mockImplementation(() => true);
      expect(await guard.canActivate(context)).toBe(true);
    });

    it('should deny access for invalid JWT token', async () => {
      jest.spyOn(guard, 'canActivate').mockImplementation(() => {
        throw new UnauthorizedException();
      });

      try {
        await guard.canActivate(context);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('create', () => {
    it('should create a new Todo', async () => {
      const createTodo: CreateTodoDto = {
        title: 'Todo 1',
        description: 'Test description',
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockTodo);

      expect(await controller.create(createTodo, mockUser)).toBe(mockTodo);
    });
  });

  describe('findAll', () => {
    it('should return an array of Todo list', async () => {
      const result: Todo[] = [mockTodo];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      expect(await controller.findAll(mockUser)).toBe(result);
    });
  });

  describe('update', () => {
    const updateTodo: UpdateTodoDto = {
      title: mockTodo.title,
      description: mockTodo.description,
      status: TodoStatus.INPROGRESS,
    };
    const result = { ...mockTodo, status: updateTodo.status } as Todo;

    it('should update and return updated todo', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(result);
      expect(await controller.update(mockTodo.id, updateTodo, mockUser)).toBe(
        result,
      );
    });
  });
});
