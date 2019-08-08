/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { IFocusedPuzzleProps, ITemplate } from "entities";
import { Grid, Typography } from "@material-ui/core";
import { AddIcon } from "@magnit/icons";
import { Fab } from "@magnit/components";
import { Close as CloseIcon } from "@material-ui/icons";

interface IReferenceAssetProps extends IFocusedPuzzleProps {
    template: ITemplate;
    // flag indication this asset should render
    // button which adds new asset when clicked
    addAssetButton: boolean;

    onTemplateChange(template: ITemplate): void;

    onAddAsset(id: string): void;

    onDeleteAsset(id: string): void;
}

export const ReferenceAsset: React.FC<IReferenceAssetProps> = ({ focused, ...props }) => {
    function onAddAsset() {
        props.onAddAsset(props.id);
    }

    function onDeleteAsset() {
        props.onDeleteAsset(props.id);
    }

    return (
        <Grid css={() => ({ ...(!focused ? { display: "none" } : {}) })} item xs={3}>
            <Grid
                container
                justify="center"
                alignItems="center"
                direction="column"
                css={theme => ({
                    height: "100%",
                    border: `1px solid ${theme.colors.lightGray}`,
                    borderRadius: theme.radius(0.5),
                    minHeight: theme.spacing(20),
                    position: "relative",
                })}
            >
                {!props.addAssetButton && (
                    <React.Fragment>
                        <img
                            css={css`
                                width: 100%;
                                height: 100%;
                            `}
                            alt="asset"
                            src="https://via.placeholder.com/1920x1024"
                        />
                        <div
                            onClick={onDeleteAsset}
                            css={theme => ({
                                padding: theme.spacing(0.5),
                                borderRadius: "50%",
                                background: theme.colors.gray,
                                color: theme.colors.white,
                                position: "absolute",
                                top: "-12px", // TODO: dynamic calculation
                                right: "-12px", // TODO: dynamic calculation
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                            })}
                        >
                            <CloseIcon css={theme => ({ fontSize: theme.fontSize.normal })} />
                        </div>
                    </React.Fragment>
                )}
                {props.addAssetButton && (
                    <React.Fragment>
                        <Fab
                            css={theme => ({
                                width: theme.spacing(5),
                                height: theme.spacing(5),
                                marginBottom: theme.spacing(),
                            })}
                            onClick={onAddAsset}
                        >
                            <AddIcon />
                        </Fab>
                        <Typography
                            css={theme => ({
                                userSelect: "none",
                                fontSize: theme.fontSize.sNormal,
                                color: theme.colors.secondary,
                            })}
                            align="center"
                        >
                            Добавить фото
                        </Typography>
                    </React.Fragment>
                )}
            </Grid>
        </Grid>
    );
};
