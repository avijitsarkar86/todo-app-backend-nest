import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { Repository } from 'typeorm';
import { Todo, TodoStatus } from './entities/todo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { User } from '../user/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

const mockuser: User = {
  id: '4110bd77-9f77-4ef6-9f2c-3f8d8e5cf992',
  username: 'testuser',
  password: 'hashedpassword',
  todos: [],
};

const mockTodo: Todo = {
  id: '456',
  title: 'Test todo',
  description: 'test desc',
  user: mockuser,
  status: TodoStatus.PENDING,
  created_at: new Date(),
  updated_at: new Date(),
};

describe('TodoService', () => {
  let service: TodoService;
  let repository: Repository<Todo>;

  const mockTodoRepo = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockTodoRepo,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createTodo: CreateTodoDto = {
        title: mockTodo.title,
        description: mockTodo.description,
      };

      jest.spyOn(repository, 'save').mockResolvedValue(mockTodo);
      expect(await service.create(createTodo, mockuser)).toBe(mockTodo);
    });
  });

  it('should return all todo', async () => {
    const todos = [mockTodo];
    jest.spyOn(repository, 'find').mockResolvedValue(todos as Todo[]);
    expect(await service.findAll(mockuser)).toBe(todos);
  });

  describe('update', () => {
    const updateTodo: UpdateTodoDto = {
      title: mockTodo.title,
      description: mockTodo.description,
      status: TodoStatus.PENDING,
    };

    it('should update a todo', async () => {
      const result = { ...mockTodo, status: updateTodo.status } as Todo;

      jest.spyOn(mockTodoRepo, 'findOne').mockResolvedValue(mockTodo);
      jest.spyOn(repository, 'save').mockResolvedValue(result);

      expect(await service.update(mockTodo.id, updateTodo, mockuser)).toBe(
        result,
      );
    });

    it('should throw NotFoundException when id is invalid', async () => {
      jest.spyOn(mockTodoRepo, 'findOne').mockResolvedValue(null);
      await expect(
        service.update(mockTodo.id, updateTodo, mockuser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // // it('should return a todo by id', async () => {
  // //   const todo = {
  // //     title: 'Todo 1',
  // //     description: 'Test description',
  // //     status: 'pending',
  // //   };
  // //   jest.spyOn(repository, 'findOne').mockResolvedValue(todo as Todo);
  // //   expect(await service.findOne('1')).toBe(todo);
  // // });

  describe('remove', () => {
    it('should remove a todo', async () => {
      jest.spyOn(mockTodoRepo, 'findOne').mockResolvedValue(mockTodo);
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
      expect(await service.remove(mockTodo.id, mockuser)).toBe(undefined);
    });

    it('should throw NotFoundException when id is invalid', async () => {
      jest.spyOn(mockTodoRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
      // expect(await service.remove(mockTodo.id, mockuser)).toBe(undefined);
      await expect(service.remove(mockTodo.id, mockuser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
