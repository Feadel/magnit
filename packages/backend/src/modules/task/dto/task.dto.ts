import { ApiModelProperty } from "@nestjs/swagger";
import { BaseDto } from "../../../shared/dto/base.dto";
import { TemplateAnswerDto } from "../../template/dto/template-answer.dto";
import { TemplateDto } from "../../template/dto/template.dto";
import { ETaskStatus } from "../entities/task.entity";
import { TaskStageDto } from "./task-stage.dto";

export class TaskDto<T = TaskDto<object>> extends BaseDto<T> {
    @ApiModelProperty() readonly title: string;
    @ApiModelProperty() readonly description: string;
    @ApiModelProperty({ enum: ["in_progress", "on_check", "draft", "completed"] })
    readonly status: ETaskStatus;
}

export class FullTaskDto extends TaskDto<FullTaskDto> {
    @ApiModelProperty({ type: [Number] }) readonly templates: number[];
    @ApiModelProperty({ type: [Number] }) readonly stages: number[];
}

class EditableTemplateDto extends TemplateDto<EditableTemplateDto> {
    @ApiModelProperty() readonly editable: boolean;
    @ApiModelProperty({ type: [TemplateAnswerDto] }) readonly answers: TemplateAnswerDto[];
}

export class ExtendedTaskDto extends TaskDto<ExtendedTaskDto> {
    @ApiModelProperty({ type: [EditableTemplateDto] }) readonly templates: EditableTemplateDto[];
    @ApiModelProperty({ type: [TaskStageDto] }) readonly stages: TaskStageDto[];
}