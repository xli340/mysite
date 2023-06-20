import React from "react";
import { Stack } from "@mui/material";

export type WrapperVariant = "small" | "regular";

interface WrapperProps {
  children: any;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
}) => {
  return <Stack direction="column" spacing={2}>{children}</Stack>;
};
