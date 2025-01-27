import { Column, DeepPartial, Entity, Index, OneToMany } from "typeorm";
import { PrimaryBaseEntity } from "../../../shared/entities/primary-base.entity";
import { TemplateAnswer } from "../../template/entities/template-answer.entity";
import { TaskDocument } from "./task-document.entity";
import { TaskStage } from "./task-stage.entity";
import { TemplateAssignment } from "./tempalte-assignment.entity";

export enum ETaskStatus {
    IN_PROGRESS = "in_progress",
    ON_CHECK = "on_check",
    DRAFT = "draft",
    COMPLETED = "completed",
    EXPIRED = "expired",
}

@Entity()
export class Task extends PrimaryBaseEntity<Task> {
    constructor(dto?: DeepPartial<Task>) {
        super();
        this.construct(this, dto);
    }

    @Index()
    @Column("varchar")
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Index()
    @Column("varchar")
    status: ETaskStatus;

    @Column({ type: "varchar", nullable: true })
    id_owner: string;

    @Index()
    @Column({ type: "varchar", nullable: true })
    id_assignee: string;

    @Column({ type: "int", default: 3 })
    notify_before: number;

    @OneToMany(() => TemplateAssignment, assignment => assignment.task, { cascade: true })
    assignments: TemplateAssignment[];

    @OneToMany(() => TemplateAnswer, answer => answer.task)
    answers: TemplateAnswer[];

    @OneToMany(() => TaskStage, stage => stage.task, { cascade: true })
    stages: TaskStage[];

    @OneToMany(() => TaskDocument, document => document.task)
    documents: TaskStage[];
}
