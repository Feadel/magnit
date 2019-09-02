/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Button } from "@magnit/components";
import { SendIcon } from "@magnit/icons";
import { ETaskStatus, ETerminals } from "@magnit/services";
import { ITask, TaskEditor } from "@magnit/task-editor";
import { ITemplate } from "@magnit/template-editor";
import { Grid, Typography } from "@material-ui/core";
import { Redirect } from "@reach/router";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Snackbar } from "components/snackbar";
import { AppContext } from "context";
import _ from "lodash";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { addTemplateAssignment, createTask, getTemplate, getTemplates } from "services/api";

interface IEditableTemplate extends ITemplate {
    editable: boolean;
}

export const CreateTask: React.FC = () => {
    const context = useContext(AppContext);
    const [templates, setTemplates] = useState<IEditableTemplate[]>([]);
    const [task, setTask] = useState<ITask>({
        id: 0,
        title: ETerminals.EMPTY,
        templates: [],
        stages: [],
        status: ETaskStatus.DRAFT,
    });
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(false); // success/error snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ETerminals.EMPTY as string,
    }); // open/close snackbar

    useEffect(() => {
        getTemplates(context.courier)
            .then(response => {
                return response.templates.map(template => ({
                    ...template,
                    id: template.id.toString(),
                }));
            })
            .then(templates => {
                return Promise.all(
                    templates.map(template => getTemplate(context.courier, Number(template.id))),
                );
            })
            .then(responses => {
                const buffer: any[] = [];
                responses.forEach(response => buffer.push(response.template));
                setTemplates([...buffer]);
            })
            .catch(console.error);
    }, [context.courier]);

    function onSnackbarClose(event?: React.SyntheticEvent, reason?: string) {
        if (reason === "clickaway") {
            return;
        }
        if (!error) {
            setRedirect(true);
        }
        setSnackbar({ open: false, message: ETerminals.EMPTY });
        // wait till animation ends
        setTimeout(() => setError(false), 100);
    }

    function onTaskChange(task: Partial<ITask>): void {
        const isValidTask = (value: object): value is ITask =>
            _.has(value, "id") && _.has(value, "title") && _.has(value, "templates");

        if (isValidTask(task)) {
            setTask({ ...task });
        }
    }

    function onTaskSave(): void {
        createTask(context.courier, _.omit(task, ["id", "templates"]))
            .then(async response => {
                if (!response.taskId) {
                    return;
                }
                await addTemplateAssignment(
                    context.courier,
                    Number(response.taskId),
                    (task.templates || []).map(_.toNumber),
                );
            })
            .then(() => setSnackbar({ open: true, message: "Задание успешно сохранено!" }))
            .catch(() => {
                setSnackbar({ open: true, message: "Ошибка сохранения задания!" });
                setError(true);
            });
    }

    return (
        <SectionLayout>
            {redirect && <Redirect to="/tasks" noThrow />}
            <SectionTitle title="Создание задания">
                <Grid item>
                    <Button
                        variant="contained"
                        scheme="blue"
                        css={theme => ({ margin: `0 ${theme.spacing(1)}` })}
                        onClick={onTaskSave}
                        disabled={snackbar.open}
                    >
                        <SendIcon />
                        <Typography>Отправить</Typography>
                    </Button>
                </Grid>
            </SectionTitle>
            <Grid
                css={theme => ({
                    maxWidth: theme.maxTemplateWidth,
                    margin: theme.spacing(4),
                    position: "relative",
                    opacity: snackbar.open ? 0.5 : 1,
                    transition: "opacity 0.3s ease-in-out",
                    pointerEvents: snackbar.open ? "none" : "initial",
                })}
            >
                <TaskEditor<ITask>
                    variant="create"
                    initialState={task}
                    templates={templates}
                    onTaskChange={onTaskChange}
                />
            </Grid>
            <Snackbar
                open={snackbar.open}
                error={error}
                onClose={onSnackbarClose}
                message={snackbar.message}
            />
        </SectionLayout>
    );
};
