import { Button, Typography } from "@mui/material";
import styled from "styled-components";
import theme from "../../../core/theme/theme";

export const Overlay = styled.div<{ $small?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  overflow-x: hidden;
  overflow-y: scroll;
  position: fixed;
  inset: 0;
  z-index: 50;
  outline: none;
  background: ${(props) => (props.$small ? "#fff" : "")};
`;

export const ModalContainer = styled.div`
  position: relative;
`;

export const ModalContent = styled.div<{ $showModal: boolean }>`
  transform: translateY(0);
  transition: transform 300ms;
  height: 100%;
  opacity: 1;
  ${(props) =>
    !props.$showModal &&
    `
    transform: translateY(100%);
    opacity: 0;
  `}
`;

export const StyledModal = styled.div`
  transform: translateY(0);
  height: 100%;
  @media (min-width: 1024px) {
    height: auto;
  }
  border: 0;
  border-radius: 0.375rem;
  //box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  outline: none;
`;

export const ModalHeader = styled.div`
  flex: none;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 0.375rem 0.375rem 0 0;
  justify-content: space-between;
  display: flex;
  position: relative;
  font-weight: bold;
  font-size: 1.2pc;
`;

export const CloseButton = styled(Button)`
  padding: 0.25rem;
  border: 0;
  transition: opacity 0.3s;
  position: absolute;
  &:hover {
    opacity: 0.7;
  }
`;

export const ModalBody = styled.div`
  flex: 1;
  padding: 2%;
`;

export const ModalFooter = styled.div`
  flex: none;
  flex-direction: column;
  padding: 1%;
`;

export const ContentTitle = styled(Typography)`
  color: ${theme.COLORS.PURPLE4} !important;
  font-size: 1.7rem !important;
  font-weight: bold !important;
  padding-left: 1rem;
`;
