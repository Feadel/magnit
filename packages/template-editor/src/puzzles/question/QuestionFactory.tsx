/** @jsx jsx */

import * as React from "react";
import { useContext } from "react";
import { jsx } from "@emotion/core";
import { Question } from "./Question";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { EditorContext } from "context";

export class QuestionFactory implements IPuzzleFactory {
    create({ puzzle, ...props }: IPuzzleFactoryProps): React.ReactNode {
        const context = useContext(EditorContext);
        const { template, ...rest } = context;

        return (
            <Question
                template={template!}
                id={puzzle.id}
                title={puzzle.title}
                {...rest}
                {...props}
            />
        );
    }
}
