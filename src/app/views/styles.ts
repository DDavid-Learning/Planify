import { Box, styled } from "@mui/material";
import { TableCell, TableHead } from "@mui/material";

export const StyledTableHead = styled(TableHead)`
  background-color: #4b0082;
`;

export const StyledTableCell = styled(TableCell)`
  color: white;
  font-weight: bold;
  background-color: #4b0082;
`;

export const Container = styled(Box)`
  display: flex;
  flex: 1;
  padding: 2rem 2rem 0 2rem;
  background-color: #e0e0e0;
`;

export const Content = styled(Box)`
  display: flex;
  flex: 1;
  border-radius: 20px 20px 0 0;
  background-color: #ffffff;
  flex-direction: column;
`;
