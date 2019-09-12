/* tslint:disable:no-shadowed-variable */

import { ArgumentMetadata, Inject, Injectable, PipeTransform } from "@nestjs/common";
import { ETaskStatus, Task } from "../entities/task.entity";
import { TaskService } from "../services/task.service";

@Injectable()
export class TaskExpiredPipe implements PipeTransform<string | unknown, Promise<string | unknown>> {
    constructor(@Inject(TaskService) private readonly taskService: TaskService) {}

    async transform(id: string | unknown, metadata: ArgumentMetadata): Promise<string | unknown> {
        if (typeof id !== "string") {
            const tasks = await this.taskService.findAll();
            await Promise.all(tasks.map(async task => this.setTaskExpired(task)));
        } else {
            const task = await this.taskService.findById(id);
            await this.setTaskExpired(task);
        }
        return id;
    }

    private async setTaskExpired(task: Task): Promise<void> {
        if (task.status === ETaskStatus.EXPIRED) {
            return;
        }
        const activeStage = await this.taskService.findActiveStage(task.id.toString());
        if (activeStage && new Date(activeStage.deadline).valueOf() <= Date.now()) {
            await this.taskService.update(task.id, { status: ETaskStatus.EXPIRED });
        }
    }
}