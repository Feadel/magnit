/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { IFocusedPuzzleProps, IPuzzle, ITemplate, TChangeEvent } from "entities";
import { Grid, MenuItem, Typography } from "@material-ui/core";
import { css, jsx } from "@emotion/core";
import { traverse } from "services/json";
import _ from "lodash";
import { InputField, SelectField } from "@magnit/components";
import { EPuzzleType, ETerminals } from "@magnit/services";
import uuid from "uuid/v4";

interface IQuestionPuzzleProps extends IFocusedPuzzleProps {
    template: ITemplate;
    title: string;

    onTemplateChange(template: ITemplate): void;
}

const answerMenuItems = [
    { label: "Текстовое поле", type: EPuzzleType.TEXT_ANSWER },
    { label: "Числовое поле", type: EPuzzleType.NUMERIC_ANSWER },
    { label: "Один из списка", type: EPuzzleType.RADIO_ANSWER },
    { label: "Несколько из списка", type: EPuzzleType.CHECKBOX_ANSWER },
    { label: "Дата", type: EPuzzleType.DATE_ANSWER },
    { label: "Выпадающий список", type: EPuzzleType.DROPDOWN_ANSWER },
    { label: "Загрузка файлов", type: EPuzzleType.UPLOAD_FILES },
    { label: "Справочное поле", type: EPuzzleType.REFERENCE_ANSWER },
];

export const Question: React.FC<IQuestionPuzzleProps> = ({ template, id, focused, ...props }) => {
    const [answersType, setAnswersType] = useState((ETerminals.EMPTY as unknown) as EPuzzleType);
    const [questionTitle, setQuestionTitle] = useState(props.title);

    const templateSnapshot = useRef<ITemplate>({} as ITemplate);
    const answerTypeSnapshot = useRef<EPuzzleType>((ETerminals.EMPTY as unknown) as EPuzzleType);

    const onTemplateChange = useCallback(() => {
        traverse(template, (value: any) => {
            if (!_.isObject(value) || !("puzzles" in value)) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (!("id" in puzzle) || puzzle.id !== id) {
                return;
            }
            // set initial answerType based on
            // first element of question children
            let nextAnswerType = answersType;
            if (!nextAnswerType) {
                const childrenHeadPuzzle = _.head(puzzle.puzzles) || {
                    puzzleType: (ETerminals.EMPTY as unknown) as EPuzzleType,
                };
                setAnswersType(childrenHeadPuzzle.puzzleType);
                nextAnswerType = childrenHeadPuzzle.puzzleType;
            }
            if (!puzzle.puzzles.length) {
                return;
            }
            // set changed puzzle type of question children
            // and strip it's length to 1 only after initial render
            if (answersType !== answerTypeSnapshot.current) {
                puzzle.puzzles.length = 1;
            }
            puzzle.puzzles = puzzle.puzzles.map(child => {
                return {
                    ...child,
                    puzzleType: nextAnswerType,
                    title: answersType === answerTypeSnapshot.current ? child.title : "",
                };
            });
            // reset conditions and validations
            puzzle.validations = [];
            puzzle.conditions = [];
            // check if there are nested children of answer
            // if there aren't any, we proceed with adding stub ones
            const hasChildrenOfPuzzles = puzzle.puzzles.reduce((prev, curr) => {
                if (prev) {
                    return prev;
                }
                return !!(curr.puzzles || []).length;
            }, false);
            // REFERENCE_ANSWER needs specific handling as it's nested answer
            // so we have to add it's children when choosing this type
            if (nextAnswerType === EPuzzleType.REFERENCE_ANSWER && !hasChildrenOfPuzzles) {
                puzzle.puzzles = puzzle.puzzles.map(childPuzzle => {
                    const puzzle = {
                        id: uuid(),
                        puzzleType: EPuzzleType.REFERENCE_TEXT,
                        title: ETerminals.EMPTY,
                        description: ETerminals.EMPTY,
                        order: childPuzzle.puzzles.length,
                        puzzles: [],
                        conditions: [],
                        validations: [],
                    };
                    return {
                        ...childPuzzle,
                        puzzles: [
                            puzzle,
                            {
                                ...puzzle,
                                puzzleType: EPuzzleType.REFERENCE_ASSET,
                                order: childPuzzle.puzzles.length + 1,
                            },
                        ],
                    };
                });
            } else if (nextAnswerType !== EPuzzleType.REFERENCE_ANSWER && hasChildrenOfPuzzles) {
                puzzle.puzzles = puzzle.puzzles.map(child => {
                    return {
                        ...child,
                        puzzles: [],
                    };
                });
            }
            puzzle.title = questionTitle;
            answerTypeSnapshot.current = nextAnswerType;
            return true;
        });
        // trigger template update if snapshot changed
        // also cloneDeep in order to track changes above in isEqual
        if (_.isEqual(template, templateSnapshot.current) || _.isEmpty(templateSnapshot.current)) {
            templateSnapshot.current = _.cloneDeep(template);
            return;
        }
        templateSnapshot.current = _.cloneDeep(template);
        props.onTemplateChange(templateSnapshot.current);
    }, [answersType, questionTitle, template]);

    useEffect(() => onTemplateChange(), [answersType, focused]);

    function onAnswerTypeChange(event: TChangeEvent): void {
        setAnswersType(event.target.value as EPuzzleType);
    }

    function onQuestionTitleChange(event: TChangeEvent): void {
        setQuestionTitle(event.target.value as string);
    }

    if (!focused) {
        return (
            <Grid
                container
                alignItems="center"
                css={theme => ({
                    // need for correct toolbar positioning
                    // see https://github.com/DavidArutiunian/magnit/issues/46
                    marginTop: theme.spacing(-2),
                })}
            >
                <Grid item>
                    <Typography
                        component="span"
                        variant="body1"
                        css={theme => ({ paddingRight: theme.spacing() })}
                    >
                        {props.index + 1}.
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        variant="body1"
                        component="span"
                        css={theme => ({ color: !questionTitle ? theme.colors.gray : "initial" })}
                    >
                        {questionTitle || "Название вопроса"}
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container direction="column">
            <Grid item xs={12}>
                <Grid
                    container
                    alignItems="flex-end"
                    spacing={2}
                    css={theme => ({
                        marginBottom: `${theme.spacing()} !important`,
                        // need for correct toolbar positioning
                        // see https://github.com/DavidArutiunian/magnit/issues/46
                        marginTop: `${theme.spacing(-2)} !important`,
                    })}
                >
                    <Grid item>
                        <Typography
                            css={theme => ({
                                fontSize: theme.fontSize.medium,
                                marginBottom: theme.spacing(0.25),
                            })}
                        >
                            {props.index + 1}.
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs
                        css={css`
                            padding-left: 0;
                        `}
                    >
                        <InputField
                            fullWidth
                            placeholder="Название вопроса"
                            value={questionTitle}
                            onChange={onQuestionTitleChange}
                            onBlur={onTemplateChange}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <SelectField
                            id={"question-puzzle-type"}
                            fullWidth={true}
                            value={answersType || ETerminals.EMPTY}
                            onChange={onAnswerTypeChange}
                        >
                            {answerMenuItems.map(({ label, type }, index) => (
                                <MenuItem value={type} key={index}>
                                    {label}
                                </MenuItem>
                            ))}
                        </SelectField>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};