
import { Box, Button, Paper } from "@mui/material";
import styled from "styled-components";

export const Container = styled(Box)`
  padding: 1em 0;
  display: flex;
  flex-direction: column;
  align-Items: center;
`;

export const ButtonsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-radius: 3px;
  margin: auto;
`;

export const SecondContainer = styled(Box)`
  display: flex;
  flex-direction: row;
`;

export const StyledPaper = styled(Paper)`
  display: flex;
  position: absolute !important;
  align-items: center;
  gap: -1px;
  border-radius: 3px;
  border-left: 10px solid #1f299c;
  background: #f1f1f1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 18px 1px rgba(0, 0, 0, 0.5);
`;

export const StyledDivPrimaryCalendar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
export const StyledDivSelectCalendar = styled.div`
  display: flex;
  padding: 2% 7px 7px 7px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  justify-content: space-between;
  background-color: #f3f3f4;
`;

export const StyledDivTextCalendar = styled.div`
  display: flex;
  padding: 5px 40px;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 26%;
  flex-shrink: 0;
`;
export const StyledDivCalendar = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 13px;
  flex-shrink: 0;

  .MuiDateCalendar-viewTransitionContainer {
    height: 15rem;
  }
`;
export const StyledButton = styled(Button)`
  && {
    font-size: 16px;
    color: #515050;

    &:hover {
      background-color: rgb(243, 243, 244);
    }

    :focus-visible {
      outline: -webkit-focus-ring-color auto 1px;
    }
  }
`;
export const StyledButtonDates = styled(Button)`
  && {
    display: initial;
    text-align: left;
    width: 100%;
    color: #000;
    font-size: 12px;
    text-transform: none;
  }
`;

