/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { QuestionPuzzle } from "./QuestionPuzzle";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { EditorContext, IEditorContext } from "index";

export class QuestionFactory implements IPuzzleFactory {
    createItem({ puzzle, ...rest }: IPuzzleFactoryProps): React.ReactNode {
        return (
            <EditorContext.Consumer>
                {({ template, onTemplateChange }: IEditorContext) => (
                    <QuestionPuzzle
                        {...rest}
                        {...{ template, onTemplateChange, id: puzzle.id, title: puzzle.title }}
                    />
                )}
            </EditorContext.Consumer>
        );
    }
}
