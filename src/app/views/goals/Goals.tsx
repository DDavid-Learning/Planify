import { useQuery } from "@tanstack/react-query";
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, CircularProgress, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";

import { useAuth } from "../../../core/context/auth/useAuth";
import { GoalsService } from "../../../core/services/goals/goalsService";
import theme from "../../../core/theme/theme";
import { formatDateBr, formatCurrencyBR } from "../../../core/utils/globalFunctions";
import { StyledTableHead, StyledTableCell } from "../styles";
import { TGoalResponse } from "../../../core/models/goalModel";

const cellStyle = { fontSize: '1.0rem' };

const Goals = () => {
  const userID = useAuth().userId;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['goals', userID],
    queryFn: () => GoalsService.getAllGoals(),
    enabled: !!userID,
    staleTime: Infinity
  });


  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: theme.COLORS.PURPLE3 }} />
      </Box>
    );
  }
  return (
    <>
      <Box sx={{ display: "flex", flex: 1, flexDirection: "row", alignItems: "center" }}>
        <Button
          sx={{ color: theme.COLORS.PURPLE3 }}
          onClick={() => { }}
        >
          <FilterListIcon />
          {/* <Typography sx={{ fontSize: "0.8pc", marginLeft: "0.5rem", marginTop: "4px" }}>
            {showPendingTransactions ? "Esconder pendentes" : "Exibir pendentes"}
          </Typography> */}
        </Button>
        <Button sx={{ color: theme.COLORS.PURPLE3, marginLeft: "auto" }}
          onClick={() => { }}>
          <AddIcon />
          <Typography sx={{ fontSize: "0.8pc", marginLeft: "0.5rem", marginTop: "4px" }}>
            Adicionar Transação
          </Typography>
        </Button>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", flex: 8, flexDirection: "row" }}>
        <TableContainer >
          <Table stickyHeader>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell>Nome</StyledTableCell>
                <StyledTableCell>Data limite</StyledTableCell>
                <StyledTableCell>Saldo atual</StyledTableCell>
                <StyledTableCell>Meta</StyledTableCell>
              </TableRow>
            </StyledTableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <CircularProgress color="inherit" size={20} />
                  </TableCell>
                </TableRow>
              ) : (
                data.map((goal: TGoalResponse) => (
                  <TableRow key={goal.id}>
                    <TableCell sx={cellStyle}>{goal.name}</TableCell>
                    <TableCell sx={cellStyle}>{formatDateBr(goal.targetDate)}</TableCell>
                    <TableCell sx={cellStyle}>{formatCurrencyBR(goal.currentAmount)}</TableCell>
                    <TableCell sx={cellStyle}>{formatCurrencyBR(goal.targetAmount)}</TableCell>
                  </TableRow>
                )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

    </>
  )
}

export default Goals