import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ComponentProps, DetailedHTMLProps, FC, ReactNode, } from "react";
import { isValidElement } from "react";
import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import { Button as AriaButton, Link as AriaLink } from "react-aria-components";
import { Tooltip } from "@/features/call-ken/components/base/tooltip/tooltip";
type Placement = ComponentProps<typeof Tooltip>["placement"];
import { cx } from "@/features/call-ken/utils/cx";
import { isReactComponent } from "@/features/call-ken/utils/is-react-component";
export const styles = {
    secondary: "bg-primary text-fg-quaternary shadow-xs-skeumorphic ring-1 ring-primary ring-inset hover:bg-primary_hover hover:text-fg-quaternary_hover disabled:shadow-xs disabled:ring-disabled_subtle",
    tertiary: "text-fg-quaternary hover:bg-primary_hover hover:text-fg-quaternary_hover",
};
export interface CommonProps {
    isDisabled?: boolean;
    size?: "xs" | "sm";
    color?: "secondary" | "tertiary";
    icon?: FC<{
        className?: string;
    }> | ReactNode;
    tooltip?: string;
    tooltipPlacement?: Placement;
}
export interface ButtonProps extends CommonProps, DetailedHTMLProps<Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "slot">, HTMLButtonElement> {
    slot?: AriaButtonProps["slot"];
}
interface LinkProps extends CommonProps, DetailedHTMLProps<Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "color">, HTMLAnchorElement> {
}
export type Props = ButtonProps | LinkProps;
export const ButtonUtility = ({ tooltip, className, isDisabled, icon: Icon, size = "sm", color = "secondary", tooltipPlacement = "top", ...otherProps }: Props) => {
    const href = "href" in otherProps ? otherProps.href : undefined;
    const Component = href ? AriaLink : AriaButton;
    let props = {};
    if (href) {
        props = {
            ...otherProps,
            href: isDisabled ? undefined : href,
            ...(isDisabled ? { "data-rac": true, "data-disabled": true } : {}),
        };
    }
    else {
        props = {
            ...otherProps,
            type: otherProps.type || "button",
            isDisabled,
        };
    }
    const content = (<Component aria-label={tooltip} {...props} className={cx("group relative inline-flex h-max cursor-pointer items-center justify-center rounded-md p-1.5 outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:text-fg-disabled_subtle", styles[color], "*:data-icon:pointer-events-none *:data-icon:shrink-0 *:data-icon:text-current *:data-icon:transition-inherit-all", size === "xs" ? "*:data-icon:size-4" : "*:data-icon:size-5", className)}>
            {isReactComponent(Icon) && <Icon data-icon/>}
            {isValidElement(Icon) && Icon}
        </Component>);
    if (tooltip) {
        return (<Tooltip title={tooltip} placement={tooltipPlacement} isDisabled={isDisabled} offset={size === "xs" ? 4 : 6}>
                {content}
            </Tooltip>);
    }
    return content;
};
