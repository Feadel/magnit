import { ApiModelProperty } from "@nestjs/swagger";
import { ConstructableDto } from "./constructable.dto";

export abstract class BaseDto<T = BaseDto<object>> extends ConstructableDto<T> {
    @ApiModelProperty({ description: "ISO date format" }) readonly created_at: string;
    @ApiModelProperty({ description: "ISO date format" }) readonly updated_at: string;
}
