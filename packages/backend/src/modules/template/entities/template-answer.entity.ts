import {
    Column,
    DeepPartial,
    Entity,
    Generated,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { BaseEntity } from "../../../shared/entities/base.entity";
import { Task } from "../../task/entities/task.entity";
import { TemplateAnswerLocation } from "./template-answer-location.entity";
import { Template } from "./template.entity";

@Entity("template_answer")
export class TemplateAnswer extends BaseEntity<TemplateAnswer> {
    constructor(dto?: DeepPartial<TemplateAnswer>) {
        super();
        this.construct(this, dto);
    }

    @Column()
    @Generated("rowid")
    id: number;

    @Index()
    @PrimaryColumn()
    id_template: number;

    @ManyToOne(() => Template, template => template.answers)
    @JoinColumn({ name: "id_template", referencedColumnName: "id" })
    template: Template;

    @Index()
    @PrimaryColumn()
    id_task: number;

    @ManyToOne(() => Task, task => task.answers)
    @JoinColumn({ name: "id_task", referencedColumnName: "id" })
    task: Task;

    @ManyToOne(() => TemplateAnswerLocation)
    @JoinColumn({ name: "id_location", referencedColumnName: "id" })
    location: TemplateAnswerLocation;

    @Index()
    @PrimaryColumn({ type: "varchar" })
    id_puzzle: string;

    @Column("varchar")
    answer_type: string;

    @PrimaryColumn({ type: "varchar" })
    answer: string;

    @Column({ type: "text", nullable: true })
    comment: string;
}
