import * as React from "react";
import Button from "@mui/material/Button";
import { StyledDialog, StyledDialogActions, StyledDialogContent, StyledDialogTitle } from "./styles";


interface IDialogProps {
  isOpen: boolean;
  title: string;
  onCloseAction: () => void;
  confirmAction: () => void;
  body?: React.ReactNode;
  disabled?: boolean;
  confirmText?: string;
}

const DefaultDialog = (props: IDialogProps) => {
  return (
    <StyledDialog open={props.isOpen}>
      <StyledDialogTitle>{props.title}</StyledDialogTitle>
      {props.body && <StyledDialogContent>{props.body}</StyledDialogContent>}
      <StyledDialogActions>
        <Button variant="contained" onClick={props.onCloseAction}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          disabled={props.disabled}
          onClick={props.confirmAction}
          autoFocus
        >
          {props.confirmText ? props.confirmText : "Confirmar"}
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default DefaultDialog;
