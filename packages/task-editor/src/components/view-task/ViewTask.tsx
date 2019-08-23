/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import {
    Button,
    ButtonLikeText,
    Checkbox,
    DateField,
    SelectableBlockWrapper,
    SelectField,
    StepperWrapper,
} from "@magnit/components";
import { AddIcon, CheckIcon } from "@magnit/icons";
import { ETaskStatus, ETerminals, getFriendlyDate, IEditorService } from "@magnit/services";
import {
    Dialog,
    FormControl,
    FormControlLabel,
    Grid,
    MenuItem,
    Typography,
} from "@material-ui/core";
import { TemplateRenderer } from "components/renderers";
import { IDocument, IExtendedTask, IStageStep, IVirtualDocument, TChangeEvent } from "entities";
import _ from "lodash";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import uuid from "uuid/v4";
import { ChangeAssigneIllustration } from "./ChangeAssigneIllustration";

interface IViewTaskProps {
    task: Partial<IExtendedTask>;
    service: IEditorService;
    documents: IVirtualDocument[];
    templates: Omit<IDocument, "__uuid">[];
    focusedPuzzleId?: string;
    templateSnapshots: Map<string, object>;

    onAddStage?(step: IStageStep): void;

    onDeleteStage?(id: number): void;

    onEditableChange(documentId: number, editable: boolean): void;

    onTemplatesChange(uuid: string, event: TChangeEvent): void;
}

export const ViewTask: React.FC<IViewTaskProps> = props => {
    const [open, setOpen] = useState(false);
    const { service, task, focusedPuzzleId, templateSnapshots, documents, templates } = props;
    const { onAddStage, onDeleteStage, onEditableChange, onTemplatesChange } = props;

    const { stages } = task;
    const initialStepsState =
        stages &&
        stages.length > 0 &&
        stages.map(stage => ({
            ...stage,
            completed: Date.now() >= new Date(stage.dueDate).valueOf(),
            editable: false,
        }));
    const defaultStepsState = [
        {
            id: 0,
            title: ETerminals.EMPTY,
            dueDate: ETerminals.EMPTY,
            completed: false,
            editable: true,
        },
    ];
    const [steps, setSteps] = useState<IStageStep[]>(initialStepsState || defaultStepsState);

    const prevStages = useRef(_.cloneDeep(stages));
    useEffect(() => {
        if (!initialStepsState) {
            return;
        }
        if (!_.isEqual(prevStages, stages) && !_.isEqual(steps, initialStepsState)) {
            setSteps(initialStepsState);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stages]);

    useEffect(() => {
        const diffSteps = steps
            .filter(step => step.title && step.dueDate)
            .filter(step => stages && !stages.find(stage => stage.id === step.id));
        if (!diffSteps.length) {
            return;
        }
        diffSteps.forEach(step => onAddStage && onAddStage(step));
    }, [steps, stages, onAddStage]);

    function onDialogClose(): void {
        setOpen(false);
    }

    function onAssigneeChange(): void {
        setOpen(true);
    }

    function onAssigneeChangeComplete(): void {
        setOpen(false);
    }

    const onAddStep = useCallback((): void => {
        const last = _.last(steps);
        if (!last) {
            return;
        }
        setSteps([
            ...steps,
            {
                id: last.id + 1,
                title: ETerminals.EMPTY,
                dueDate: ETerminals.EMPTY,
                completed: false,
                editable: true,
            },
        ]);
    }, [steps]);

    const onChangeStepTitle = useCallback(
        (id: number, value: string): void => {
            if (steps.some(step => step.id === id)) {
                const stepIndex = steps.findIndex(step => step.id === id);
                steps[stepIndex].title = value;
                setSteps([...steps]);
            }
        },
        [steps],
    );

    const onChangeStepDate = useCallback(
        (id: number, value: string): void => {
            if (steps.some(step => step.id === id)) {
                const stepIndex = steps.findIndex(step => step.id === id);
                steps[stepIndex].dueDate = value;
                setSteps([...steps]);
            }
        },
        [steps],
    );

    const onStepDelete = useCallback(
        (id: number) => {
            // disallow deleting if only 1 stage present
            if (steps.length < 2) {
                return;
            }
            if (steps.some(step => step.id === id)) {
                const stepIndex = steps.findIndex(step => step.id === id);
                steps.splice(stepIndex, 1);
                setSteps([...steps]);
                if (onDeleteStage) {
                    onDeleteStage(id);
                }
            }
        },
        [onDeleteStage, steps],
    );

    const onEditableChangeHandler = useCallback(
        (documentId: number, editable: boolean) => {
            onEditableChange(documentId, editable);
        },
        [onEditableChange],
    );

    const getTaskId = useCallback(() => _.get(task, "id", uuid()).toString(), [task]);

    return (
        <React.Fragment>
            <Dialog
                onClose={onDialogClose}
                open={open}
                classes={{ paper: "paper" }}
                css={css`
                    .paper {
                        overflow: hidden;
                    }
                `}
            >
                <Grid
                    container
                    spacing={2}
                    direction="column"
                    css={theme => ({
                        padding: theme.spacing(6),
                        minWidth: theme.spacing(50),
                    })}
                >
                    <Grid item>
                        <Grid container justify="center" alignItems="center">
                            <Grid item>
                                <ChangeAssigneIllustration />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography css={theme => ({ fontSize: theme.fontSize.medium })}>
                            Выберите исполнителя:
                        </Typography>
                    </Grid>
                    <Grid item>
                        <SelectField fullWidth placeholder="Выберите исполнителя">
                            <MenuItem>Гончар Семён Платонович</MenuItem>
                            <MenuItem>Маслов Гарри Валерьевич</MenuItem>
                            <MenuItem>Буров Юлиан Данилович</MenuItem>
                            <MenuItem>Воронов Юрий Виталиевич</MenuItem>
                            <MenuItem>Лановой Устин Иванович</MenuItem>
                        </SelectField>
                    </Grid>
                    <Grid item css={theme => ({ paddingTop: `${theme.spacing(5)} !important` })}>
                        <Grid container justify="center" alignItems="center">
                            <Grid item>
                                <Button
                                    variant="contained"
                                    scheme="blue"
                                    onClick={onAssigneeChangeComplete}
                                >
                                    <CheckIcon />
                                    <Typography>Сохранить</Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Dialog>
            <SelectableBlockWrapper
                css={theme => ({
                    padding: theme.spacing(3),
                    zIndex: focusedPuzzleId === getTaskId() ? 1300 : "initial",
                })}
                onFocus={service.onPuzzleFocus.bind(service, getTaskId())}
                onMouseDown={service.onPuzzleFocus.bind(service, getTaskId())}
                focused={focusedPuzzleId === getTaskId()}
                id={getTaskId()}
            >
                <Grid container spacing={2}>
                    <Grid
                        item
                        xs={12}
                        css={theme => ({
                            paddingLeft: theme.spacing(4),
                            paddingRight: theme.spacing(4),
                        })}
                    >
                        <Typography css={theme => ({ fontSize: theme.fontSize.large })}>
                            {task.title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <span
                            css={theme => ({
                                width: theme.spacing(),
                                height: theme.spacing(),
                                borderRadius: "50%",
                                display: "inline-block",
                                background: task.status
                                    ? getColorByStatus(theme, task.status)
                                    : "none",
                                margin: "2px 10px 2px 0",
                            })}
                        />
                        <span
                            css={theme => ({
                                color: task.status
                                    ? getColorByStatus(theme, task.status)
                                    : "inherit",
                            })}
                        >
                            {task.status && getTitleByStatus(task.status)}
                        </span>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs css={theme => ({ marginTop: theme.spacing(4) })}>
                        <Grid container direction={"row"}>
                            <InfoField title="Администратор" value="Барановский Прохор Артёмович" />
                            <InfoField
                                title="Исполнитель"
                                value="Рукастый Иннокентий Петрович"
                                editable
                                label="Изменить исполнителя"
                                onEditableClick={onAssigneeChange}
                            />
                        </Grid>
                        <Grid
                            container
                            direction={"row"}
                            css={theme => ({ marginTop: theme.spacing(3) })}
                        >
                            <InfoField
                                title="Местоположение"
                                value="Челябинская область, г. Челябинск, ул. Железная, д. 5"
                            />
                            <InfoField title="Формат объекта" value="МК" />
                        </Grid>
                    </Grid>
                    <Grid item xs>
                        <StepperWrapper
                            onTitleChange={onChangeStepTitle}
                            onStepDelete={onStepDelete}
                            steps={steps.map(step => ({
                                id: step.id,
                                editable: step.editable,
                                completed: step.completed,
                                title: step.title,
                                content: (
                                    <DateField
                                        disabled={!step.editable}
                                        onChange={event =>
                                            onChangeStepDate(step.id, event.target.value)
                                        }
                                        value={
                                            !step.editable
                                                ? getFriendlyDate(new Date(step.dueDate))
                                                : step.dueDate
                                        }
                                    />
                                ),
                            }))}
                        />
                        <Button
                            variant="outlined"
                            scheme="outline"
                            css={theme => ({
                                color: theme.colors.primary,
                                marginLeft: theme.spacing(6),
                            })}
                            onClick={onAddStep}
                        >
                            <AddIcon />
                            <Typography>Новый этап</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </SelectableBlockWrapper>
            {documents.map(document => (
                <TaskDocument
                    documents={documents}
                    key={document.__uuid}
                    document={document}
                    templates={templates}
                    service={service}
                    templateSnapshots={templateSnapshots}
                    focusedPuzzleId={focusedPuzzleId}
                    onEditableChange={onEditableChangeHandler}
                    onTemplateChange={onTemplatesChange}
                />
            ))}
        </React.Fragment>
    );
};

interface ITaskDocumentProps {
    documents: IVirtualDocument[];
    document: IVirtualDocument;
    service: IEditorService;
    focusedPuzzleId?: string;
    templateSnapshots: Map<string, object>;
    templates: Omit<IDocument, "__uuid">[];

    onEditableChange(documentId: number, editable: boolean): void;

    onTemplateChange(uuid: string, event: TChangeEvent): void;
}

const TaskDocument: React.FC<ITaskDocumentProps> = props => {
    const { templateSnapshots, focusedPuzzleId, service, document, templates, documents } = props;

    const snapshot = templateSnapshots.get(document.id.toString());
    const focused = focusedPuzzleId === document.__uuid;

    function onEditableChange(event: TChangeEvent, checked: boolean) {
        props.onEditableChange(document.id, checked);
    }

    return (
        <SelectableBlockWrapper
            onFocus={service.onPuzzleFocus.bind(service, document.__uuid)}
            onMouseDown={service.onPuzzleFocus.bind(service, document.__uuid)}
            css={theme => ({
                padding: theme.spacing(3),
                zIndex: focusedPuzzleId === document.__uuid ? 1300 : "initial",
            })}
            focused={focused}
            id={document.__uuid}
        >
            {document.virtual && (
                <Grid item xs={3} css={theme => ({ paddingLeft: theme.spacing(3) })}>
                    <SelectField
                        placeholder="Выбрать шаблон"
                        value={document.id === -1 ? "" : document.id}
                        fullWidth
                        onChange={event => props.onTemplateChange(document.__uuid, event)}
                    >
                        {templates
                            .filter(template =>
                                document.id !== template.id
                                    ? !documents.find(document => document.id === template.id)
                                    : true,
                            )
                            .map(template => (
                                <MenuItem key={template.id} value={template.id}>
                                    {template.title}
                                </MenuItem>
                            ))}
                    </SelectField>
                </Grid>
            )}
            <Grid container css={theme => ({ padding: theme.spacing(4) })}>
                <Grid item xs={9}>
                    <Typography css={theme => ({ fontSize: theme.fontSize.xLarge })}>
                        {_.get(snapshot, "title")}
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Grid container justify="center" alignItems="flex-end">
                        <FormControl>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={document.editable}
                                        css={theme => ({ marginRight: theme.spacing() })}
                                        onChange={onEditableChange}
                                    />
                                }
                                label="Разрешить редактирование"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {focused && <TemplateRenderer template={snapshot} />}
                </Grid>
            </Grid>
        </SelectableBlockWrapper>
    );
};

interface IMainInfoProps {
    title: string;
    value: string;
    editable?: boolean;
    label?: string;

    onEditableClick?(): void;
}

const InfoField: React.FC<IMainInfoProps> = ({ title, value, editable, label, ...props }) => {
    return (
        <Grid item xs>
            <Typography
                css={theme => ({
                    color: theme.colors.secondary,
                    fontSize: theme.fontSize.smaller,
                    textTransform: "uppercase",
                })}
            >
                {title}
            </Typography>
            <Typography
                css={theme => ({
                    fontSize: theme.fontSize.normal,
                    color: theme.colors.black,
                })}
            >
                {value}
            </Typography>
            {editable && <ButtonLikeText onClick={props.onEditableClick}>{label}</ButtonLikeText>}
        </Grid>
    );
};

function getTitleByStatus(status: ETaskStatus): string {
    return {
        [ETaskStatus.IN_PROGRESS]: "В работе",
        [ETaskStatus.ON_CHECK]: "На проверке",
        [ETaskStatus.COMPLETED]: "Завершено",
        [ETaskStatus.DRAFT]: "Черновик",
    }[status];
}

function getColorByStatus(theme: any, status: ETaskStatus): string {
    return {
        [ETaskStatus.IN_PROGRESS]: theme.colors.violet,
        [ETaskStatus.ON_CHECK]: theme.colors.darkYellow,
        [ETaskStatus.COMPLETED]: theme.colors.green,
        [ETaskStatus.DRAFT]: theme.colors.secondary,
    }[status];
}
