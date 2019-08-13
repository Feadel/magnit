import { BaseResponse } from "../../../shared/responses/base.response";
import { ApiModelProperty } from "@nestjs/swagger";
import { TaskWithTemplatesDto } from "../dto/task-with-templates.dto";

export class GetTaskResponse extends BaseResponse {
    @ApiModelProperty({ type: TaskWithTemplatesDto }) readonly task: TaskWithTemplatesDto;
}