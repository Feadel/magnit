import { ApiModelProperty } from "@nestjs/swagger";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";
import { TTemplateType } from "../entities/template.entity";
import { SectionDto } from "./section.dto";

export class TemplateDto<T = TemplateDto<object>> extends PrimaryBaseDto<TemplateDto> {
    @ApiModelProperty() readonly title: string;
    @ApiModelProperty() readonly description: string;
    @ApiModelProperty({ enum: ["light", "complex"] })
    readonly type: TTemplateType;
    @ApiModelProperty({ type: [SectionDto] }) readonly sections: SectionDto[];
    @ApiModelProperty() readonly version: number;
}
