import React from "react";
import { CssBaseline } from "@mui/material";
import { useLocation } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { LayoutContainer } from "./styles";
import theme from "../../../core/theme/theme";

interface Props {
  children: React.ReactNode;
}

const FullScreenContainer = ({ children }: Props) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login" || location.pathname === "/registro";
  return (
    <ThemeProvider theme={theme}>
      <LayoutContainer $isLoginPage={isLoginPage}>
        <CssBaseline />
        {children}
      </LayoutContainer>
    </ThemeProvider>
  );
};

export default FullScreenContainer;
