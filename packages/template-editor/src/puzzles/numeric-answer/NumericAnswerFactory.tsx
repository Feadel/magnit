/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { NumericAnswer } from "./NumericAnswer";

export class NumericAnswerFactory implements IPuzzleFactory {
    create({ puzzle, focused, ...props }: IPuzzleFactoryProps): React.ReactNode {
        return <NumericAnswer id={puzzle.id} focused={focused} {...props} />;
    }
}
