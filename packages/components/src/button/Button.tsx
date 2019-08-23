/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { Button as MaterialButton } from "@material-ui/core";
import _ from "lodash";
import { Link } from "@reach/router";

const variants = {
    blue: ({ spacing, colors }: any) => ({
        color: colors.white,
        border: `1px solid ${colors.primary}`,
        background: `${colors.primary} !important`,
        hover: {
            color: colors.white,
            boxShadow: `0 ${spacing(0.5)} ${spacing()} ${colors.primary}40 !important`,
        },
        active: { background: `${colors.darkPrimary} !important` },
    }),
    green: ({ spacing, colors }: any) => ({
        color: colors.white,
        border: `1px solid ${colors.green}`,
        background: `${colors.green} !important`,
        hover: {
            color: colors.white,
            boxShadow: `0 ${spacing(0.5)} ${spacing()} ${colors.green}40 !important`,
        },
        active: { background: `${colors.darkGreen} !important` },
    }),
    violet: ({ spacing, colors }: any) => ({
        color: colors.white,
        border: `1px solid ${colors.violet}`,
        background: `${colors.violet} !important`,
        hover: {
            color: colors.white,
            boxShadow: `0 ${spacing(0.5)} ${spacing()} ${colors.violet}40 !important`,
        },
        active: { background: `${colors.darkViolet} !important` },
    }),
    outline: ({ spacing, colors }: any) => ({
        color: colors.primary,
        border: `1px solid ${colors.primary} !important`,
        background: "none !important",
        hover: { boxShadow: `0 ${spacing(0.5)} ${spacing()} ${colors.primary}40 !important` },
    }),
};

export interface IButtonProps {
    title?: string;
    scheme?: keyof Omit<typeof variants, "main">;
    component?: React.ReactNode;
    icon?: React.ReactNode;

    onClick?(): void;
}

type TButtonProps = IButtonProps &
    React.ComponentProps<typeof MaterialButton> &
    React.ComponentProps<typeof Link>;

export const Button: React.FC<TButtonProps> = props => {
    const { scheme = "blue", children, ...rest } = props;
    const variant = _.get(variants, scheme);

    return (
        <MaterialButton
            css={theme => ({
                textTransform: "none",
                transitionDuration: "0.3s",
                transitionProperty: "box-shadow, background, color",
                transitionTimingFunction: "ease-in-out",
                boxShadow: "none",
                padding: `${theme.spacing()} ${theme.spacing(2)}`,
                borderRadius: theme.radius(5),
                ":hover": { ..._.get(variant(theme), "hover", {}) },
                ":active": { ..._.get(variant(theme), "active", {}) },
                ...variant(theme),
            })}
            {...rest}
        >
            {children}
        </MaterialButton>
    );
};