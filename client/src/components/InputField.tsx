import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  TextField,
} from "@mui/material";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl error={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <TextField {...field} id={field.name} size="small" />
      {error ? <FormHelperText>{error}</FormHelperText> : null}
    </FormControl>
  );
};
