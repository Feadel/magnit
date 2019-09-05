/** @jsx jsx */

import { jsx } from "@emotion/core";
import {
    Button,
    IColumn,
    InputField,
    ITab,
    SelectField,
    TableWrapper,
    TabsWrapper,
} from "@magnit/components";
import { AddIcon, ReturnIcon, SendIcon } from "@magnit/icons";
import { ETaskStatus, ETerminals, getFriendlyDate } from "@magnit/services";
import { Grid, Paper, Typography } from "@material-ui/core";
import { Link, Redirect, RouteComponentProps } from "@reach/router";
import { EmptyList } from "components/list";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { AppContext } from "context";
import _ from "lodash";
import * as React from "react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { getTasks, IGetTasksResponse, updateTask } from "services/api";

const tabs: ITab[] = [
    { value: ETaskStatus.IN_PROGRESS.replace("_", "-"), label: "В работе" },
    { value: ETaskStatus.ON_CHECK.replace("_", "-"), label: "На проверке" },
    { value: ETaskStatus.DRAFT, label: "Черновики" },
    { value: ETaskStatus.COMPLETED, label: "Завершенные" },
];

const columns: IColumn[] = [
    { key: "title", label: "Название задания", sortable: true },
    { key: "description", label: "Описание задания", sortable: true },
    { key: "createdAt", label: "Дата создания", sortable: true },
    { key: "updatedAt", label: "Дата последнего обновления", sortable: true },
];

type TRouteProps = { "*": string };

type TTask = IGetTasksResponse["tasks"][0] & { selected: boolean };

interface IUpdateTaskListOptions {
    sort?: "asc" | "desc";
    sortBy?: keyof Omit<TTask, "selected">;
    title?: string;
}

export const TasksList: React.FC<RouteComponentProps<TRouteProps>> = props => {
    const tab = props["*"];

    const context = useContext(AppContext);

    const [tasks, setTasks] = useState<TTask[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<Map<number, TTask>>(new Map());
    const [searchQuery, setSearchQuery] = useState<string>(ETerminals.EMPTY);
    const [total, setTotal] = useState(0);

    const clearSelectedTasks = useCallback(() => {
        selectedTasks.clear();
        setSelectedTasks(new Map(selectedTasks));
    }, [selectedTasks]);

    const updateTasksList = useCallback(
        ({ sort, sortBy, title }: IUpdateTaskListOptions = {}) => {
            clearSelectedTasks();
            // get task by current status
            // also apply queries
            getTasks(
                context.courier,
                getTaskStatusByTab(tab),
                (sort || "").toUpperCase() as "ASC" | "DESC",
                sortBy,
                title,
            )
                .then(response =>
                    setTasks(
                        response.tasks.map(task => ({
                            ...task,
                            selected: false,
                            createdAt: getFriendlyDate(new Date(task.createdAt!), true),
                            updatedAt: getFriendlyDate(new Date(task.updatedAt!), true),
                        })),
                    ),
                )
                .catch(console.error);
            // get total count of all tasks
            getTasks(context.courier)
                .then(response => setTotal(response.tasks.length))
                .catch(console.error);
        },
        [clearSelectedTasks, context.courier, tab],
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => updateTasksList(), [context.courier, tab]);

    const [redirect, setRedirect] = useState({ redirect: false, to: "" });

    function onRowClick(row: object) {
        if (!_.isObject(row) || !_.has(row, "id")) {
            return;
        }
        setRedirect({ redirect: true, to: _.get(row, "id") });
    }

    const onRowSelectToggleCallback = useCallback(
        (row: object, selected: boolean) => {
            if (!_.isObject(row) || !_.has(row, "id")) {
                return;
            }
            // select or un-select tasks for rejecting
            const id = _.get(row, "id")!;
            if (selected) {
                selectedTasks.set(id, row as TTask);
            } else {
                selectedTasks.delete(id);
            }
            setSelectedTasks(new Map(selectedTasks));
            // update actual task
            const taskIndex = tasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                tasks[taskIndex].selected = selected;
                setTasks([...tasks]);
            }
        },
        [selectedTasks, tasks],
    );

    const onBulkRejectClickCallback = useCallback(() => {
        const tasksToUpdate = Array.from(selectedTasks.values());
        // allow reject only tasks in IN_PROGRESS state
        if (tasksToUpdate.some(task => task.status !== ETaskStatus.IN_PROGRESS)) {
            return;
        }
        // TODO: perform one request
        // https://github.com/DavidArutiunian/magnit/issues/88
        Promise.all(
            tasksToUpdate.map(async task =>
                updateTask(context.courier, Number(task.id), { status: ETaskStatus.ON_CHECK }),
            ),
        )
            .then(() => updateTasksList())
            .catch(console.error);
    }, [context.courier, selectedTasks, updateTasksList]);

    const onBulkCompleteClickCallback = useCallback(() => {
        const tasksToUpdate = Array.from(selectedTasks.values());
        // allow complete only tasks in DRAFT & ON_CHECK states
        if (
            tasksToUpdate.some(
                task => ![ETaskStatus.DRAFT, ETaskStatus.ON_CHECK].includes(task.status),
            )
        ) {
            return;
        }
        // TODO: perform one request
        // https://github.com/DavidArutiunian/magnit/issues/88
        Promise.all(
            tasksToUpdate.map(async task =>
                updateTask(context.courier, Number(task.id), { status: ETaskStatus.IN_PROGRESS }),
            ),
        )
            .then(() => updateTasksList())
            .then(() => clearSelectedTasks())
            .catch(console.error);
    }, [clearSelectedTasks, context.courier, selectedTasks, updateTasksList]);

    const onSelectToggleCallback = useCallback(
        (selected: boolean) => {
            const nextTasks = tasks.map(task => ({ ...task, selected }));
            setTasks(nextTasks);
            if (selected) {
                nextTasks.forEach(task => task.id && selectedTasks.set(task.id, task));
                setSelectedTasks(new Map(selectedTasks));
            } else {
                clearSelectedTasks();
            }
        },
        [clearSelectedTasks, selectedTasks, tasks],
    );

    const updateTaskListDebounced = useRef(_.debounce(updateTasksList, 150));

    function onSearchQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchQuery(event.target.value);
        updateTaskListDebounced.current({ title: event.target.value });
    }

    const onRequestSortCallback = useCallback(
        (sort: "asc" | "desc", sortBy: keyof Omit<TTask, "selected">) => {
            updateTasksList({ sort, sortBy });
        },
        [updateTasksList],
    );

    const empty = !total;

    return (
        <SectionLayout>
            {redirect.redirect && <Redirect to={`tasks/view/${redirect.to}`} noThrow />}
            <SectionTitle title="Список заданий">
                {process.env.REACT_APP_ALLOW_CREATE_TASK && (
                    <Grid item hidden={empty}>
                        <Button component={Link} to="create" variant="contained" scheme="blue">
                            <AddIcon />
                            <Typography>Создать задание</Typography>
                        </Button>
                    </Grid>
                )}
            </SectionTitle>
            {empty && (
                <EmptyList
                    title="Заданий нет"
                    button={
                        <React.Fragment>
                            {process.env.REACT_APP_ALLOW_CREATE_TASK && (
                                <Grid item>
                                    <Button
                                        component={Link}
                                        to="create"
                                        variant="contained"
                                        scheme="blue"
                                    >
                                        <AddIcon />
                                        <Typography>Создать задание</Typography>
                                    </Button>
                                </Grid>
                            )}
                        </React.Fragment>
                    }
                >
                    {process.env.REACT_APP_ALLOW_CREATE_TASK && (
                        <React.Fragment>
                            <div>Для создания задания нажмите кнопку</div>
                            <div>Создать задание</div>
                        </React.Fragment>
                    )}
                </EmptyList>
            )}
            {!empty && (
                <Paper
                    square={true}
                    css={({ spacing, ...theme }) => ({
                        margin: spacing(3),
                        boxShadow: `0 0 ${spacing(2)} ${theme.colors.lightGray} !important`,
                    })}
                >
                    <Grid
                        container
                        direction="row"
                        css={theme => ({
                            paddingTop: theme.spacing(2),
                            paddingLeft: theme.spacing(2),
                        })}
                    >
                        <TabsWrapper tabs={tabs}>
                            <Grid
                                container
                                direction="column"
                                css={theme => ({ padding: theme.spacing(3) })}
                            >
                                <Grid container direction="row" spacing={2}>
                                    <Grid item xs>
                                        <InputField
                                            placeholder="Поиск ..."
                                            fullWidth
                                            value={searchQuery}
                                            onChange={onSearchQueryChange}
                                            css={({ spacing, ...theme }) => ({
                                                borderRadius: theme.radius(5),
                                                background: theme.colors.white,
                                                border: `1px solid ${theme.colors.lightGray}`,
                                                transition: "border 0.25s ease-in-out",
                                                cursor: "pointer",
                                                ":hover, :active": {
                                                    border: `1px solid ${theme.colors.primary}`,
                                                },
                                                div: {
                                                    ":before, :after": {
                                                        border: "none !important",
                                                    },
                                                },
                                                input: {
                                                    padding: `${spacing(2)} ${spacing(4)}`,
                                                },
                                            })}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <SelectField placeholder="Выберите регион" fullWidth />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <SelectField placeholder="Выберите филиал" fullWidth />
                                    </Grid>
                                </Grid>
                                <Grid item css={theme => ({ padding: theme.spacing(3) })}>
                                    <TableWrapper
                                        selectable
                                        columns={columns}
                                        data={tasks}
                                        onRowClick={onRowClick}
                                        onRowSelectToggle={onRowSelectToggleCallback}
                                        onSelectToggle={onSelectToggleCallback}
                                        onRequestSort={onRequestSortCallback}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    {tab === ETaskStatus.IN_PROGRESS.replace("_", "-") && (
                                        <Button
                                            variant="contained"
                                            scheme="blue"
                                            onClick={onBulkRejectClickCallback}
                                        >
                                            <ReturnIcon />
                                            <Typography>Отозвать</Typography>
                                        </Button>
                                    )}
                                    {tab !== ETaskStatus.IN_PROGRESS.replace("_", "-") &&
                                        tab !== ETaskStatus.COMPLETED && (
                                            <Button
                                                variant="contained"
                                                scheme="blue"
                                                onClick={onBulkCompleteClickCallback}
                                            >
                                                <SendIcon />
                                                <Typography>Отправить</Typography>
                                            </Button>
                                        )}
                                </Grid>
                            </Grid>
                        </TabsWrapper>
                    </Grid>
                </Paper>
            )}
        </SectionLayout>
    );
};

TasksList.displayName = "TasksList";

function getTaskStatusByTab(tab?: string): ETaskStatus {
    if (!tab) {
        return ETaskStatus.IN_PROGRESS;
    }
    return ((tab as unknown) as string).replace("-", "_") as ETaskStatus;
}
