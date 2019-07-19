/** @jsx jsx */

import * as React from "react";
import { Grid } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { IFocusedPuzzleProps } from "entities";
import { InputField } from "@magnit/components";

export const NumericAnswer: React.FC<IFocusedPuzzleProps> = ({ focused }) => {
    return (
        <Grid
            container
            alignItems="flex-end"
            css={theme => ({
                paddingBottom: theme.spacing(2),
                display: focused ? "" : "none",
            })}
        >
            <Grid item xs={12}>
                <InputField
                    disabled
                    type="number"
                    fullWidth
                    placeholder="Ответ"
                    css={{
                        "input::-webkit-inner-spin-button, input::-webkit-outer-spin-button": {
                            margin: 0,
                            display: "none",
                        },
                    }}
                />
            </Grid>
        </Grid>
    );
};