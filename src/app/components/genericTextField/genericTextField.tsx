import React from 'react'
import {
    InputProps,
    TextField,
    TextFieldProps,
    FormHelperText
} from '@mui/material'

type TDefaultTextField<T> = {
    name: string
    label: string
    value: T
    props?: InputProps & TextFieldProps
    small?: boolean
    error?: boolean | undefined
    inputMode?: "numeric" | "decimal" | "tel" | "search" | "email" | undefined
    helperText?: React.ReactNode
    type?: React.HTMLInputTypeAttribute
    onBlur?:
    | React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined
    onChange?:
    | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined
    style?: React.CSSProperties | undefined
    onChangeManual?: (value: string) => void
}

function GenericTextField<T>({
    name,
    label,
    value,
    props,
    helperText,
    error,
    type,
    onBlur,
    onChange,
    style,
    onChangeManual,
    inputMode
}: TDefaultTextField<T>) {

    return (
        <TextField
            helperText={
                error && (
                    <FormHelperText
                        sx={{ margin: -0.5, padding: 0 }}
                        error={error}
                    >
                        {String(helperText)}
                    </FormHelperText>
                )
            }
            onChange={onChange}
            onBlur={onBlur}
            type={type ? type : undefined}
            size="small"
            variant="outlined"
            autoComplete="off"
            margin="none"
            id={name}
            label={label}
            inputMode={inputMode ? inputMode : undefined}
            value={value}
            error={error}
            style={style}
            {...props}
        />
    )
}

export default GenericTextField
