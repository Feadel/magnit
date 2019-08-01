import { TaskController } from "../task.controller";
import { TaskService } from "../services/task.service";
import { TaskServiceMock } from "../../../shared/mocks/task.service.mock";
import { Test } from "@nestjs/testing";
import { TaskDto } from "../dto/task.dto";
import { TemplateService } from "../../template/services/template.service";
import { templateService } from "../../template/test/mocks/template.service.mock";

describe("TaskController", () => {
    let taskController: TaskController;
    const taskService = new TaskServiceMock();
    const payload: TaskDto = {
        id: 0,
        name: "task",
        description: "task",
        status: "in_progress",
    };

    beforeEach(async () => {
        const providers = [
            {
                provide: TaskService,
                useValue: taskService,
            },
            {
                provide: TemplateService,
                useValue: templateService,
            },
        ];
        const controllers = [TaskController];
        const app = await Test.createTestingModule({ providers, controllers }).compile();

        taskController = app.get(TaskController);
    });

    it("should return empty list of tasks", async () => {
        const expected = { success: 1, total: 0, tasks: [] };
        jest.spyOn(taskService, "findAll").mockImplementationOnce(async () => []);
        expect(await taskController.findAll()).toStrictEqual(expected);
    });

    it("should create task", async () => {
        const expected = { success: 1, task_id: 0 };
        jest.spyOn(taskService, "save").mockImplementationOnce(async () => ({ id: 0 }));
        expect(await taskController.create(payload)).toStrictEqual(expected);
    });

    it("should get task by id", async () => {
        const expected = { success: 1, task: { ...payload, templates: [] } };
        jest.spyOn(taskService, "findById").mockImplementationOnce(async () => payload);
        expect(await taskController.findById("0")).toStrictEqual(expected);
    });

    it("should return list of task with created task", async () => {
        const expected = { success: 1, total: 1, tasks: [payload] };
        jest.spyOn(taskService, "findAll").mockImplementationOnce(async () => [payload]);
        expect(await taskController.findAll()).toStrictEqual(expected);
    });

    it("should add template to task", async () => {
        const expected = { success: 1 };
        jest.spyOn(taskService, "findById").mockImplementationOnce(async () => ({ id: 0 }));
        expect(await taskController.addTemplates("0", [0])).toStrictEqual(expected);
    });

    it("should check template was added to task", async () => {
        const expected = { success: 1, task: { ...payload, templates: [0] } };
        jest.spyOn(taskService, "findById").mockImplementationOnce(async () => payload);
        jest.spyOn(templateService, "findByTaskId").mockImplementationOnce(async () => [{ id: 0 }]);
        expect(await taskController.findById("0")).toStrictEqual(expected);
    });

    it("should update task", async () => {
        const expected = { success: 1, task_id: 0 };
        const updatedPayload = { ...payload, name: "updated task" };
        jest.spyOn(taskService, "save").mockImplementationOnce(async () => updatedPayload);
        expect(await taskController.update("0", updatedPayload)).toStrictEqual(expected);
    });

    it("should get templates with updated task", async () => {
        const updatedPayload = { ...payload, name: "updated task" };
        const expected = { success: 1, total: 1, tasks: [updatedPayload] };
        jest.spyOn(taskService, "findAll").mockImplementationOnce(async () => [updatedPayload]);
        expect(await taskController.findAll()).toStrictEqual(expected);
    });
});
