/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { EditorContext, IEditorContext } from "TemplateEditor";
import { Conditions, Validations } from "components/conditions";
import { EPuzzleType } from "components/puzzle";
import { Grid, Tab, Tabs } from "@material-ui/core";
import { useState } from "react";

interface IContentConditionsProps {
    puzzleId: string;
    focused: boolean;
    puzzleType: EPuzzleType;
}

export const ContentConditions: React.FC<IContentConditionsProps> = props => {
    const [tab, setTab] = useState(0);

    const { puzzleId, focused, puzzleType } = props;

    function onTabChange(event: React.ChangeEvent<{}>, nextTab: number): void {
        setTab(nextTab);
    }

    return (
        <EditorContext.Consumer>
            {({ onTemplateChange, template }: IEditorContext) => {
                const conditionsTitle =
                    puzzleType === EPuzzleType.GROUP
                        ? "Условия показа группы"
                        : "Условия показа вопроса";
                const validationsTitle =
                    puzzleType === EPuzzleType.QUESTION ? "Условия валидации поля ответа" : "";
                return (
                    <Grid
                        container
                        css={theme => ({
                            marginTop: theme.spacing(2),
                            paddingLeft: theme.spacing(4),
                            paddingRight: theme.spacing(4),
                            display: focused ? "flex" : "none",
                        })}
                    >
                        <Grid
                            item
                            xs={12}
                            css={theme => ({
                                background: theme.colors.light,
                                paddingTop: theme.spacing(3),
                                paddingLeft: theme.spacing(3),
                                paddingBottom: theme.spacing(2),
                            })}
                        >
                            <Tabs
                                value={tab}
                                onChange={onTabChange}
                                css={theme => ({
                                    ".indicator": {
                                        backgroundColor: theme.colors.primary,
                                        boxShadow: theme.boxShadow.indicator,
                                        borderTopLeftRadius: theme.radius(0.5),
                                        borderTopRightRadius: theme.radius(0.5),
                                        height: "3px",
                                    },
                                })}
                                classes={{ indicator: "indicator" }}
                            >
                                <Tab
                                    css={theme => ({
                                        textTransform: "none",
                                        paddingTop: 0,
                                        paddingBottom: 0,
                                        paddingLeft: theme.spacing(3),
                                        paddingRight: theme.spacing(3),
                                        maxWidth: "max-content",
                                        fontSize: theme.fontSize.normal,
                                        letterSpacing: "normal",
                                    })}
                                    label={conditionsTitle}
                                />
                                {!!validationsTitle && (
                                    <Tab
                                        label={validationsTitle}
                                        css={theme => ({
                                            textTransform: "none",
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                            paddingLeft: theme.spacing(3),
                                            paddingRight: theme.spacing(3),
                                            maxWidth: "max-content",
                                            fontSize: theme.fontSize.normal,
                                            letterSpacing: "normal",
                                        })}
                                    />
                                )}
                            </Tabs>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            css={theme => ({
                                paddingLeft: theme.spacing(3),
                                paddingRight: theme.spacing(3),
                                paddingBottom: theme.spacing(3),
                                background: theme.colors.light,
                            })}
                        >
                            <div css={{ display: tab === 0 ? "block" : "none" }}>
                                <Conditions
                                    disabled={tab !== 0}
                                    puzzleId={puzzleId}
                                    onTemplateChange={onTemplateChange}
                                    template={template}
                                />
                            </div>
                            <div css={{ display: tab === 1 ? "block" : "none" }}>
                                <Validations
                                    disabled={tab !== 1}
                                    puzzleId={puzzleId}
                                    onTemplateChange={onTemplateChange}
                                    template={template}
                                />
                            </div>
                        </Grid>
                    </Grid>
                );
            }}
        </EditorContext.Consumer>
    );
};
