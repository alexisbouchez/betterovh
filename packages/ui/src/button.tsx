import type { ComponentProps } from "react";

export type ButtonProps = ComponentProps<"button">;

export function Button({ children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>;
}
