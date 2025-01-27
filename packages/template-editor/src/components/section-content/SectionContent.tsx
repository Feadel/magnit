/** @jsx jsx */

import { jsx } from "@emotion/core";
import { SelectableBlockWrapper } from "@magnit/components";
import { EPuzzleType, IPuzzle } from "@magnit/entities";
import { ConditionsWrapper } from "components/conditions";
import { ItemFactory } from "components/item-factory";
import _ from "lodash";
import * as React from "react";

interface IGroupOfItemsProps {
    index: number;
    puzzle: IPuzzle;
    parent?: IPuzzle;

    isFocused(id: string): boolean;

    onFocus(id: string): void;
}

export const SectionContent: React.FC<IGroupOfItemsProps> = props => {
    const { puzzle, parent } = props;

    function onFocus(): void {
        props.onFocus(puzzle.id);
    }

    const focused = props.isFocused(puzzle.id);
    const isGroup = puzzle.puzzleType === EPuzzleType.GROUP;
    const hasBorder = !focused && isGroup;

    return (
        <SelectableBlockWrapper
            onFocus={onFocus}
            onMouseDown={onFocus}
            focused={focused}
            css={theme => ({
                paddingTop: theme.spacing(2),
                paddingBottom: theme.spacing(2),
                zIndex: focused ? 1300 : 0,
            })}
        >
            <div
                css={theme => ({
                    paddingLeft: !!parent ? theme.spacing(4) : 0,
                    paddingTop: theme.spacing(),
                    paddingBottom: theme.spacing(),
                    borderTop: hasBorder ? `1px dashed ${theme.colors.gray}` : "none",
                    borderBottom: hasBorder ? `1px dashed ${theme.colors.gray}` : "none",
                })}
            >
                <ItemFactory
                    puzzle={puzzle}
                    parentPuzzle={parent}
                    index={props.index}
                    active={focused}
                    onFocus={onFocus}
                />
                {isGroup && (
                    <ConditionsWrapper
                        alwaysVisible
                        puzzleId={puzzle.id}
                        conditions={puzzle.conditions}
                        validations={puzzle.validations}
                        focused={focused}
                        puzzleType={puzzle.puzzleType}
                        answerType={_.get(_.head(puzzle.puzzles), "puzzleType")}
                    />
                )}
                {(puzzle.puzzles || []).map((childPuzzle, index) => {
                    if (childPuzzle.puzzleType === EPuzzleType.QUESTION) {
                        return (
                            <SectionContent
                                key={childPuzzle.id}
                                puzzle={childPuzzle}
                                onFocus={props.onFocus}
                                isFocused={props.isFocused}
                                index={props.index + index}
                                parent={childPuzzle}
                            />
                        );
                    }
                    return (
                        <ItemFactory
                            deep={childPuzzle.puzzleType === EPuzzleType.REFERENCE_ANSWER}
                            puzzle={childPuzzle}
                            index={index}
                            active={focused}
                            onFocus={onFocus}
                            key={childPuzzle.id}
                            parentPuzzle={puzzle}
                        />
                    );
                })}
                {!isGroup && (
                    <ConditionsWrapper
                        puzzleId={puzzle.id}
                        conditions={puzzle.conditions}
                        validations={puzzle.validations}
                        focused={focused}
                        puzzleType={puzzle.puzzleType}
                        answerType={_.get(_.head(puzzle.puzzles), "puzzleType")}
                    />
                )}
            </div>
        </SelectableBlockWrapper>
    );
};
