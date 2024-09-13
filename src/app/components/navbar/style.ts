import { Box } from "@mui/material";
import styled from "styled-components";

export const LoginLogo = styled(Box) <{ $small?: boolean }>`
  position: relative;
  background-image: url("https://i.imgur.com/d4JC24X.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: ${(props) => (props.$small ? "100%" : "100%")};
  width: ${(props) => (props.$small ? "80px" : "85px")};
  height: ${(props) => (props.$small ? "80px" : "85px")};
  position: ${(props) => (props.$small ? "absolute" : "")};
  top: ${(props) => (props.$small ? "10%" : "")};
 
`;