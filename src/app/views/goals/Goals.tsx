import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, CircularProgress, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import * as Yup from 'yup';

import { useAuth } from "../../../core/context/auth/useAuth";
import { GoalsService } from "../../../core/services/goals/goalsService";
import theme from "../../../core/theme/theme";
import { formatDateBr, formatCurrencyBR } from "../../../core/utils/globalFunctions";
import { StyledTableHead, StyledTableCell } from "../styles";
import { TGoalResponse } from "../../../core/models/goalModel";
import DefaultModal from "../../components/defaultModal/defaultModal";
import { useState } from "react";
import { getIn, useFormik } from "formik";
import CustomSelect from "../../components/CustomSelect";
import { useAppContext } from "../../../core/context/user/userContext";

const cellStyle = { fontSize: '1.0rem' };

const Goals = () => {
  const userID = useAuth().userId;

  const { categories } = useAppContext();

  const [openDepositModal, setOpenDepositModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<TGoalResponse | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [categorySelected, setCategorySelected] = useState<any>("");
  // Estado para controlar o modal de criar metas
  const [openRegisterGoal, setOpenRegisterGoal] = useState(false);

  // Funções de abertura e fechamento do modal
  const handleOpenModal = () => setOpenRegisterGoal(true);

  const handleCloseModal = () => {
    formik.resetForm();
    setCategorySelected("");
    setOpenRegisterGoal(false);
  };

  // Query para buscar metas
  const { data, isLoading: isLoadingGoals, refetch } = useQuery({
    queryKey: ['goals', userID],
    queryFn: () => GoalsService.getAllGoals(),
    enabled: !!userID,
    staleTime: Infinity
  });

  // Mutation para criação de metas
  const { mutate: registerGoal } = useMutation({
    mutationFn: GoalsService.createGoal,
    onSuccess: () => {
      refetch();
      handleCloseModal();
    },
    onError: (error) => {
      console.error("Erro ao criar meta:", error);
    },
  });

  const handleOpenDepositModal = (goal: TGoalResponse) => {
    setSelectedGoal(goal);
    setDepositAmount(0);
    setOpenDepositModal(true);
  };

  const handleCloseDepositModal = () => {
    setOpenDepositModal(false);
    setSelectedGoal(null);
  };

  const handleDepositSubmit = () => {
    if (selectedGoal) {
      GoalsService.updateGoal(selectedGoal.id, depositAmount)
        .then(() => {
          refetch();
          handleCloseDepositModal();
        })
        .catch((error) => console.error("Erro ao adicionar valor à meta:", error));
    }
  };

  // Configuração do Formik e Yup para validação do formulário
  const formik = useFormik({
    initialValues: {
      name: '',
      targetAmount: 0,
      targetDate: '',
      category: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Campo obrigatório"),
      targetAmount: Yup.number().min(1, "O valor deve ser maior que 0").required("Campo obrigatório"),
      targetDate: Yup.date().required("Campo obrigatório"),
      category: Yup.string().required("Campo obrigatório"),
    }),
    onSubmit: (values) => {
      registerGoal(values);
    },
  });

  if (isLoadingGoals) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: theme.COLORS.PURPLE3 }} />
      </Box>
    );
  }

  return (
    <>
      {/* Botão para abrir modal */}
      <Box sx={{ display: "flex", flex: 1, flexDirection: "row", alignItems: "center" }}>
        <Button
          sx={{ color: theme.COLORS.PURPLE3 }}
          onClick={() => { }}
        >
          <FilterListIcon />
        </Button>
        <Button sx={{ color: theme.COLORS.PURPLE3, marginLeft: "auto" }} onClick={handleOpenModal}>
          <AddIcon />
          <Typography sx={{ fontSize: "0.8pc", marginLeft: "0.5rem", marginTop: "4px" }}>
            Criar meta
          </Typography>
        </Button>
      </Box>
      <Divider />

      {/* Tabela de metas */}
      <Box sx={{ display: "flex", flex: 8, flexDirection: "row" }}>
        <TableContainer>
          <Table stickyHeader>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell>Nome</StyledTableCell>
                <StyledTableCell>Data limite</StyledTableCell>
                <StyledTableCell>Saldo atual</StyledTableCell>
                <StyledTableCell>Meta</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </StyledTableHead>

            <TableBody>
              {isLoadingGoals ? (
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
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleOpenDepositModal(goal)}
                        sx={{
                          backgroundColor: theme.COLORS.PURPLE3,
                          color: theme.COLORS.WHITE,
                          ":hover": { color: theme.COLORS.PURPLE3 }
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal pra depositar em uma meta */}
      <DefaultModal
        title="Adicionar Depósito"
        isOpen={openDepositModal}
        onClose={handleCloseDepositModal}
        onOpen={() => { }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
          <Typography>Meta: {selectedGoal?.name}</Typography>
          <TextField
            label="Valor do depósito"
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(Number(e.target.value))}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleDepositSubmit}
            sx={{ backgroundColor: theme.COLORS.PURPLE3, color: theme.COLORS.WHITE }}
          >
            Depositar
          </Button>
        </Box>
      </DefaultModal>

      {/* Modal de criação de meta */}
      <DefaultModal
        title='Criar meta'
        isOpen={openRegisterGoal}
        onClose={handleCloseModal}
        onOpen={handleOpenModal}
      >
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
            <TextField
              label="Nome da meta"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.name && formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              fullWidth
            />
            <TextField
              label="Valor da meta"
              name="targetAmount"
              type="number"
              value={formik.values.targetAmount}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.targetAmount && formik.errors.targetAmount)}
              helperText={formik.touched.targetAmount && formik.errors.targetAmount}
              fullWidth
            />
            <TextField
              label="Data limite"
              name="targetDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formik.values.targetDate}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.targetDate && formik.errors.targetDate)}
              helperText={formik.touched.targetDate && formik.errors.targetDate}
              fullWidth
            />
            <CustomSelect
              label="Categoria"
              name="category"
              value={categorySelected || ""}
              onChange={(e) => {
                const category = e.target.value;
                setCategorySelected(category);
                formik.setFieldValue('category', category);
              }}
              options={categories.map((option: any) => ({ value: option.id, label: option.name }))}
              error={Boolean(getIn(formik.touched, "category") && getIn(formik.errors, "category"))}
              helperText={getIn(formik.touched, "category") && getIn(formik.errors, "category")}
              placeholder="Selecione a categoria"
              style={{ width: "100%" }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: theme.COLORS.PURPLE3, color: theme.COLORS.WHITE }}
            >
              Salvar
            </Button>
          </Box>
        </form>
      </DefaultModal>
    </>
  );
};

export default Goals;
