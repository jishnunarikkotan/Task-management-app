import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NotFoundException } from '@nestjs/common';

const mockTask = {
  _id: 'someId',
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.PENDING,
};

describe('TasksService', () => {
  let service: TasksService;
  let model: Model<Task>;

  const mockTaskModel = {
    new: jest.fn().mockResolvedValue(mockTask),
    constructor: jest.fn().mockResolvedValue(mockTask),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
    countDocuments: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(1),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    model = module.get<Model<Task>>(getModelToken(Task.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
      };

      mockTaskModel.save.mockResolvedValue(mockTask);
      const result = await service.create(createTaskDto);
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks and count', async () => {
      const tasks = [mockTask];
      mockTaskModel.find.mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(tasks),
            }),
          }),
        }),
      });

      const result = await service.findAll();
      expect(result).toEqual({ tasks, totalCount: 1 });
    });
  });

  describe('findOne', () => {
    it('should find and return a task by id', async () => {
      mockTaskModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTask),
      });

      const result = await service.findOne('someId');
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task is not found', async () => {
      mockTaskModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      try {
        await service.findOne('someId');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      mockTaskModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockTask,
          title: 'Updated Task',
        }),
      });

      const result = await service.update('someId', updateTaskDto);
      expect(result.title).toEqual('Updated Task');
    });

    it('should throw NotFoundException if task to update is not found', async () => {
      mockTaskModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      try {
        await service.update('someId', {});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      mockTaskModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTask),
      });

      await service.remove('someId');
      expect(mockTaskModel.findByIdAndDelete).toHaveBeenCalledWith('someId');
    });

    it('should throw NotFoundException if task to delete is not found', async () => {
      mockTaskModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      try {
        await service.remove('someId');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});

// backend/src/tasks/tasks.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './schemas/task.schema';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    create: jest.fn(dto => ({
      _id: 'someId',
      ...dto,
    })),
    findAll: jest.fn(() => ({
      tasks: [
        {
          _id: 'someId',
          title: 'Test Task',
          description: 'Test Description',
          status: TaskStatus.PENDING,
        },
      ],
      totalCount: 1,
    })),
    findOne: jest.fn(id => ({
      _id: id,
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.PENDING,
    })),
    update: jest.fn((id, dto) => ({
      _id: id,
      ...dto,
    })),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
      };

      expect(await controller.create(createTaskDto)).toEqual({
        _id: 'someId',
        ...createTaskDto,
      });
      expect(service.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('findAll', () => {
    it('should get all tasks', async () => {
      expect(await controller.findAll(10, 1, '', '')).toEqual({
        tasks: [
          {
            _id: 'someId',
            title: 'Test Task',
            description: 'Test Description',
            status: TaskStatus.PENDING,
          },
        ],
        totalCount: 1,
      });
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should get a task by id', async () => {
      expect(await controller.findOne('someId')).toEqual({
        _id: 'someId',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
      });
      expect(service.findOne).toHaveBeenCalledWith('someId');
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      expect(await controller.update('someId', updateTaskDto)).toEqual({
        _id: 'someId',
        ...updateTaskDto,
      });
      expect(service.update).toHaveBeenCalledWith('someId', updateTaskDto);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      await controller.remove('someId');
      expect(service.remove).toHaveBeenCalledWith('someId');
    });
  });
});export const TaskSchema = SchemaFactory.createForClass(Task);
