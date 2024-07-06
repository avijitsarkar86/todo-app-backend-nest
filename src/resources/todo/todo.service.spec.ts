import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';

const mockTodoRepo = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('TodoService', () => {
  let service: TodoService;
  let repository: Repository<Todo>;

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

  it('should create a new todo', async () => {
    const createTodo: CreateTodoDto = {
      title: 'Todo 1',
      description: 'Test description',
      status: 'pending',
    };

    jest.spyOn(repository, 'save').mockResolvedValue(createTodo as Todo);

    expect(await service.create(createTodo)).toBe(createTodo);
  });

  it('should return all todo', async () => {
    const todos = [
      {
        title: 'Todo 1',
        description: 'Test description',
        status: 'pending',
      },
    ];
    jest.spyOn(repository, 'find').mockResolvedValue(todos as Todo[]);
    expect(await service.findAll()).toBe(todos);
  });

  // it('should return a todo by id', async () => {
  //   const todo = {
  //     title: 'Todo 1',
  //     description: 'Test description',
  //     status: 'pending',
  //   };
  //   jest.spyOn(repository, 'findOne').mockResolvedValue(todo as Todo);
  //   expect(await service.findOne('1')).toBe(todo);
  // });

  it('should update a todo', async () => {
    const updateTodo: CreateTodoDto = {
      title: 'Todo 1',
      description: 'Test description',
      status: 'in-progress',
    };

    jest.spyOn(repository, 'save').mockResolvedValue(updateTodo as Todo);

    expect(await service.update('1', updateTodo)).toBe(updateTodo);
  });

  it('should remove a todo', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
    expect(await service.remove('1')).toBe(undefined);
  });
});
