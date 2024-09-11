import { styled } from "@mui/material";
import { Box } from "@mui/system";

export const LayoutContainer = styled(Box)<{ $isLoginPage?: boolean }>`
  display: flex;
  height: 100svh;
  width: 100svw;
  overflow: hidden;
  align-items: ${(props) => (props.$isLoginPage ? "center" : "")};
  justify-content: ${(props) => (props.$isLoginPage ? "center" : "")};
  background-color: #f5f5f5;
`;
