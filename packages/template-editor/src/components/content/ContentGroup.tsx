/** @jsx jsx */

import * as React from "react";
import { SelectableBlockWrapper } from "../block";
import { jsx } from "@emotion/core";
import { IPuzzle } from "../../entities";
import { EPuzzleType } from "../puzzle";
import { ContentItem } from "./ContentItem";
import { ContentConditions } from "./ContentConditions";

interface IContentGroupProps {
    index: number;
    item: IPuzzle;
    parentItem?: IPuzzle;

    isFocused(id: string): boolean;

    onFocus(id: string): void;

    onBlur(event: React.SyntheticEvent): void;
}

export const ContentGroup: React.FC<IContentGroupProps> = ({
    isFocused,
    item,
    children,
    parentItem,
    ...props
}) => {
    function onFocus(): void {
        props.onFocus(item.id);
    }

    const focused = isFocused(item.id);
    const isGroup = item.puzzleType === EPuzzleType.GROUP;
    const hasBorder = !focused && isGroup;
    return (
        <SelectableBlockWrapper
            onFocus={onFocus}
            onMouseDown={onFocus}
            onBlur={props.onBlur}
            focused={focused}
            styles={theme => ({
                position: "relative",
                paddingTop: theme.spacing(2),
                paddingBottom: theme.spacing(2),
                zIndex: focused ? 1300 : 0,
            })}
        >
            <div
                css={theme => ({
                    paddingLeft: !!parentItem ? theme.spacing(4) : 0,
                })}
                style={{
                    borderTop: hasBorder ? "1px dashed #AAB4BE" : "none",
                    borderBottom: hasBorder ? "1px dashed #AAB4BE" : "none",
                }}
            >
                <ContentItem
                    item={item}
                    parentItem={parentItem}
                    index={props.index}
                    active={focused}
                    onFocus={onFocus}
                    onBlur={props.onBlur}
                />
                {item.puzzles.map((puzzle, index) => {
                    if (puzzle.puzzleType === EPuzzleType.QUESTION) {
                        return (
                            <ContentGroup
                                key={puzzle.id}
                                item={puzzle}
                                onFocus={props.onFocus}
                                onBlur={props.onBlur}
                                isFocused={isFocused}
                                index={index}
                                parentItem={item}
                            />
                        );
                    }
                    return (
                        <ContentItem
                            item={puzzle}
                            index={index}
                            active={focused}
                            onFocus={onFocus}
                            onBlur={props.onBlur}
                            key={puzzle.id}
                            parentItem={item}
                        />
                    );
                })}
                <ContentConditions
                    puzzleId={item.id}
                    focused={focused}
                    puzzleType={item.puzzleType}
                />
            </div>
        </SelectableBlockWrapper>
    );
};
