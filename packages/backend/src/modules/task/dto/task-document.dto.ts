import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";

export class TaskDocumentDto extends PrimaryBaseDto<TaskDocumentDto> {
    @ApiModelProperty() readonly filename: string;
    @ApiModelPropertyOptional() readonly original_name: string;
}
