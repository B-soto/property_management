import * as React from "react";

import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

export default function MyTextField(props) {
  const { label, width, placeholder, name, control, type = "text" } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => (
        <TextField
          sx={{ width: { width } }}
          id="outlined-basic"
          onChange={onChange}
          value={value}
          label={label}
          variant="outlined"
          placeholder={placeholder}
          type={type}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
}
