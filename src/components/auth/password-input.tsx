"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(function PasswordInput(props, ref) {
  const [visible, setVisible] = React.useState(false);

  return (
    <InputGroup>
      <InputGroupInput
        ref={ref}
        type={visible ? "text" : "password"}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          size="icon-xs"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
});
