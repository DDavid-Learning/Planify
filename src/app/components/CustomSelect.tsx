// src/components/CustomSelect.tsx
import React from 'react';
import { TextField, MenuItem, CircularProgress, FormHelperTextProps } from '@mui/material';

interface Option {
  value: any;
  label: string;
}

interface CustomSelectProps {
  label: string;
  name: string;
  value: any;
  onChange: (e: React.ChangeEvent<any>) => void;
  options: Option[];
  error?: boolean;
  helperText?: string | false | undefined;
  loading?: boolean;
  style?: React.CSSProperties;
  formHelperTextProps?: Partial<FormHelperTextProps>;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  helperText,
  loading = false,
  style,
  formHelperTextProps,
  placeholder = "Selecione uma opção",
}) => (
  <TextField
    value={value || ""}
    onChange={onChange}
    id={`outlined-select-${name}`}
    margin="none"
    select
    label={label}
    size="small"
    style={style}
    name={name}
    error={error}
    helperText={helperText}
    FormHelperTextProps={formHelperTextProps}
    SelectProps={{
      MenuProps: {
        PaperProps: {
          style: {
            maxHeight: 100,
          },
        },
      },
      sx: {
        textAlign: 'left',
        '.MuiSelect-select': {
          textAlign: 'left',
        },
      },
    }}
  >
    <MenuItem value="" disabled>{placeholder}</MenuItem>
    {loading ? (
      <MenuItem disabled sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress color="inherit" size={20} />
      </MenuItem>
    ) : (
      options.map((option, index) => (
        <MenuItem key={index} value={option.value}>
          {option.label}
        </MenuItem>
      ))
    )}
  </TextField>
);

export default CustomSelect;
