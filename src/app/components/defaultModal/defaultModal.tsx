import { Backdrop, Box, Fade, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import theme from "../../../core/theme/theme";
import { ContentTitle } from "./styles";


const style = {
  bgcolor: "#fff",
  borderRadius: 1,
  boxShadow: 24,
  zIndex: 1000,
  borderLeft: `4px solid`,
  borderLeftColor: theme.COLORS.PURPLE3,
};

export interface IModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  children: React.ReactNode;
}

const DefaultModal = (props: IModalProps) => {
  return (
    <Modal
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      disableEscapeKeyDown
      open={props.isOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={props.isOpen}>
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <ContentTitle>{props.title}</ContentTitle>
            <IconButton
              sx={{
                ":hover": { color: theme.COLORS.PURPLE3,
                 },
              }}
              onClick={props.onClose}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            {props.children}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default DefaultModal;
