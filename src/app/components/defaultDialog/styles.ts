import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
  } from "@mui/material";
  import styled from "styled-components";
  
  export const StyledDialog = styled(Dialog)`
    /* Estilos personalizados para o Dialog */
  `;
  
  export const StyledDialogTitle = styled(DialogTitle)`
    font-size: 1pc;
    font-weight: bold;
    text-align: center;
  `;
  
  export const StyledDialogContent = styled(DialogContent)`
    /* Estilos personalizados para o DialogContent */
  `;
  
  export const StyledDialogActions = styled(DialogActions)`
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  `;
  