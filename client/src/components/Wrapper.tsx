import React from "react";
import { Box } from "@mui/material";

export type WrapperVariant = "small" | "regular";

interface WrapperProps {
  children: any,
  variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box
      mt={8}
      mx="auto"
      maxWidth={variant === "regular" ? "800px" : "400px"}
      width="100%"
    >
      {children}
    </Box>
  );
};