import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { ValidateObjectId } from '../../pipes/validate-objectid.pipe';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './entities/todo.entity';
import mongoose, { Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
// import { ObjectId } from 'typeorm';

const mockTodoService = {
  findAll: jest.fn(),
  // findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const safeObjectId = (id) => {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
};

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;
  const objId = mongoose.Types.ObjectId;

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

  describe('create', () => {
    it('should create a new Todo', async () => {
      const createTodo: CreateTodoDto = {
        title: 'Todo 1',
        description: 'Test description',
        status: 'pending',
      };
      const result: Todo = {
        id: safeObjectId(objId),
        ...createTodo,
      };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createTodo)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of Todo list', async () => {
      const result: Todo[] = [
        {
          id: safeObjectId(objId),
          title: 'Todo 1',
          description: 'Test description',
          status: 'pending',
        } as Todo,
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('update', () => {
    it('should update and return updated todo', async () => {
      const updateTodo: UpdateTodoDto = {
        title: 'Todo 1 Updated',
        description: 'Test description Updated',
        status: 'complete',
      };

      jest.spyOn(service, 'update').mockResolvedValue(updateTodo);
      expect(await controller.update(objId.toString(), updateTodo)).toBe(
        updateTodo,
      );
    });

    it('should throw error if ID is invalid', async () => {
      const validateObjectIdPipe = new ValidateObjectId();

      try {
        validateObjectIdPipe.transform('invalid-id', {} as ArgumentMetadata);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('invalid object id format');
      }
    });

    it('should pass if ID is in valid format', async () => {
      const validateObjectIdPipe = new ValidateObjectId();
      const validId = new Types.ObjectId().toString();

      expect(
        validateObjectIdPipe.transform(validId, {} as ArgumentMetadata),
      ).toBe(validId);
    });
  });
});
