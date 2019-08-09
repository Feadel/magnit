/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import * as React from "react";
import { useCallback, useState } from "react";
import { Checkbox, Grid, IconButton, Typography } from "@material-ui/core";
import { css, jsx } from "@emotion/core";
import { IFocusedPuzzleProps, IPuzzle, ITemplate, TChangeEvent } from "entities";
import { traverse } from "services/json";
import { Close as DeleteIcon } from "@material-ui/icons";
import { InputField } from "@magnit/components";
import _ from "lodash";

interface ICheckboxAnswerPuzzleProps extends IFocusedPuzzleProps {
    title: string;
    template: ITemplate;
    // flag indication this checkbox should render
    // button which adds new checkbox when clicked
    addCheckboxButton: boolean;

    onTemplateChange(template: ITemplate): void;

    onAddCheckboxButton(id: string): void;

    onDeleteCheckboxButton(id: string): void;
}

export const CheckboxAnswer: React.FC<ICheckboxAnswerPuzzleProps> = ({ ...props }) => {
    const [label, setLabel] = useState(props.title || `Вариант ${props.index + 1}`);

    const onTemplateChange = useCallback(() => {
        traverse(props.template, (value: any) => {
            if (!_.has(value, "id")) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (puzzle.id !== props.id) {
                return;
            }
            puzzle.title = label;
            return true;
        });
        props.onTemplateChange({ ...props.template });
    }, [label]);

    function onLabelChange(event: TChangeEvent): void {
        setLabel(event.target.value as string);
    }

    function onAddCheckboxButton(): void {
        props.onAddCheckboxButton(props.id);
    }

    function onDeleteCheckboxButton(): void {
        props.onDeleteCheckboxButton(props.id);
    }

    if (!props.focused) {
        return (
            <Grid
                container
                alignItems="center"
                css={theme => ({ marginTop: `${theme.spacing()} !important` })}
            >
                <Grid item>
                    <Checkbox disabled css={theme => ({ marginLeft: `-${theme.spacing()}` })} />
                </Grid>
                <Grid item>
                    <Typography
                        css={theme => ({ color: !label ? theme.colors.gray : "initial" })}
                        variant="body1"
                    >
                        {label || `Вариант ${props.index + 1}`}
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    return (
        <React.Fragment>
            <Grid
                container
                alignItems="flex-end"
                spacing={2}
                css={theme => ({ marginTop: `${theme.spacing(-1)} !important` })}
            >
                <Grid item>
                    <Checkbox
                        disabled
                        css={theme => ({
                            marginLeft: `-${theme.spacing()}`,
                            paddingBottom: theme.spacing(0.5),
                        })}
                    />
                </Grid>
                <Grid
                    item
                    xs
                    css={css`
                        padding-left: 0 !important;
                    `}
                >
                    <InputField
                        fullWidth
                        value={label}
                        onChange={onLabelChange}
                        onBlur={onTemplateChange}
                    />
                </Grid>
                <Grid item css={theme => ({ padding: `${theme.spacing(0.25)} !important` })}>
                    <IconButton onClick={onDeleteCheckboxButton}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
            {props.addCheckboxButton && props.focused && (
                <Grid
                    container
                    alignItems="flex-end"
                    spacing={2}
                    css={theme => ({
                        paddingTop: theme.spacing(),
                        marginBottom: `${theme.spacing()} !important`,
                    })}
                >
                    <Grid item>
                        <Checkbox
                            disabled
                            css={theme => ({
                                marginLeft: `-${theme.spacing()}`,
                                paddingBottom: theme.spacing(0.5),
                            })}
                        />
                    </Grid>
                    <Grid
                        item
                        xs
                        css={css`
                            padding-top: 0 !important;
                            padding-left: 0 !important;
                        `}
                    >
                        <InputField
                            fullWidth
                            placeholder={"Добавить вариант"}
                            onClick={onAddCheckboxButton}
                        />
                    </Grid>
                </Grid>
            )}
        </React.Fragment>
    );
};