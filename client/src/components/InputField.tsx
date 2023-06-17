import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import { FormControl, FormLabel, TextField } from "@mui/material";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  size: _,
  type,
  ...props
}) => {
  const [field, { error }] = useField(props);
  let body = null;
  if (textarea) {
    body = (
      <TextField
        {...field}
        id={field.name}
        size="small"
        multiline
        rows={15}
        type={type}
      />
    );
  } else {
    body = <TextField {...field} id={field.name} size="small" type={type} />;
  }

  return (
    <FormControl error={!!error} sx={{ width: textarea ? "600px" : "300px" }}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      {body}
    </FormControl>
  );
};
