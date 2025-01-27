import { ApiModelPropertyOptional } from "@nestjs/swagger";
import { TaskDto } from "../dto/task.dto";
import { ETaskStatus } from "../entities/task.entity";

export class FindAllQuery {
    @ApiModelPropertyOptional({ default: 0, minimum: 0 }) readonly offset: number = 0;
    @ApiModelPropertyOptional({ default: 10, minimum: 0 }) readonly limit: number = 10;
    @ApiModelPropertyOptional({ description: "TaskDto keys", default: "title", type: String })
    readonly sortBy: keyof TaskDto = "title";
    @ApiModelPropertyOptional({ default: "ASC", enum: ["ASC", "DESC"] }) readonly sort:
        | "ASC"
        | "DESC" = "ASC";
    @ApiModelPropertyOptional({
        enum: ["in_progress", "on_check", "draft", "completed"],
        description: 'Query by status. Not compatible with "statuses"',
    })
    readonly status?: ETaskStatus;
    @ApiModelPropertyOptional({
        type: [String],
        enum: ["in_progress", "on_check", "draft", "completed"],
        description:
            'Query by multiple status (e.g. "in_progress, completed"]).' +
            ' Not compatible with "status".',
    })
    readonly statuses?: ETaskStatus[];
    @ApiModelPropertyOptional({ description: "Query by title" }) readonly title?: string;
}
