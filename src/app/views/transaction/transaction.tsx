import { useEffect, useState } from 'react'
import { StyledTableCell, StyledTableHead } from '../styles'
import { Box, Button, CircularProgress, Divider, FormControl, IconButton, InputAdornment, MenuItem, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getIn, useFormik } from 'formik';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import theme from '../../../core/theme/theme';
import DefaultModal from '../../components/defaultModal/defaultModal';
import GenericTextField from '../../components/genericTextField/genericTextField';
import { RegisterTransaction } from '../../../core/utils/validations';
import { useAuth } from '../../../core/context/auth/useAuth';
import DataPicker from '../../components/datePicker/datePicker';
import { Notification } from '../../components/toastNotification/toastNotification';
import { transactionService } from '../../../core/services/transaction/transactionService';
import StyledStatus from '../../components/styledStatus/styledStatus';
import { formatCurrencyBR, formatDateBr } from '../../../core/utils/globalFunctions';
import { useAppContext } from '../../../core/context/user/userContext';
import CustomSelect from '../../components/CustomSelect';

export interface ITransaction {
    sender: string;
    recipient: string;
    value: number;
    isExpense: boolean;
    user: string;
    category: string;
    date: string;
    status: string;
    isGoalContribution: boolean;
}

const options = [
    { label: 'Receita', value: 'false' },
    { label: 'Despesa', value: 'true' },
];

const Transaction = () => {
    const userID = useAuth().userId;
    const { transactions, refetchUserData, isLoading, categories } = useAppContext();

    const initialValues: ITransaction = {
        sender: '',
        recipient: '',
        value: 0,
        isExpense: false,
        user: userID!,
        category: '',
        date: '',
        status: 'COMPLETE',
        isGoalContribution: false,
    };

    const formik = useFormik({
        initialValues,
        validationSchema: RegisterTransaction,
        validateOnChange: false,
        onSubmit: (values) => {
            const newValues = {
                sender: values.sender,
                recipient: values.recipient,
                value: values.value,
                isExpense: values.isExpense,
                user: values.user,
                category: categorySelected,
                date: values.date,
                status: values.status || "COMPLETE"
            }

            console.log(newValues)
            console.log(categorySelected)

            transactionService.registerTransaction(newValues).then((resp) => {
                Notification("Transação adicionada com sucesso", "success")
                formik.resetForm();
                setSelectedDate(null);
                setOpenRegisterTransaction(false)
                refetchUserData();
            }).catch((error: any) => {
                Notification("Erro ao adicionar Transação", "error")
            })
        },
    });

    const [categorySelected, setCategorySelected] = useState<any>()
    const [isExpenseState, setIsExpenseState] = useState(false);
    const [datePickerOpen, setDatePickerOpen] = useState(false)
    const [openRegisterTransaction, setOpenRegisterTransaction] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
        formik.values.date
            ? dayjs(formik.values.date, 'DD/MM/YYYY')
            : null
    );
    const [openEditTransaction, setOpenEditTransaction] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [showPendingTransactions, setShowPendingTransactions] = useState(true);

    const handleDateChange = (date: Dayjs | null) => {
        setSelectedDate(date)
        formik.setFieldValue('date', date ? date.format('DD/MM/YYYY') : '')
    }

    const handleCloseModal = () => {
        setOpenRegisterTransaction(false)
        setCategorySelected("")
        setIsExpenseState(false)
        formik.resetForm();
    };

    const handleDeleteTransaction = (transactionId: string) => {
        transactionService.deleteTransaction(transactionId)
            .then(() => {
                Notification("Transação removida com sucesso", "success");
                refetchUserData();
            })
            .catch((error: any) => {
                Notification("Erro ao remover transação", error);
            });
    };

    const handleEditTransaction = (transaction: any) => {
        // Find the matching category from the categories array
        const matchingCategory = categories.find(cat => cat.name === transaction.category.name);

        setSelectedTransaction(transaction);
        setSelectedDate(dayjs(transaction.date));
        setCategorySelected(matchingCategory); // Set the matching category object
        setIsExpenseState(transaction.isExpense);
        formik.setValues({
            sender: transaction.sender,
            recipient: transaction.recipient,
            value: transaction.value,
            isExpense: transaction.isExpense,
            user: userID!,
            category: transaction.category.id,
            date: formatDateBr(transaction.date),
            status: transaction.status,
            isGoalContribution: false
        });
        setOpenEditTransaction(true);
    };

    const handleUpdateTransaction = (values: any) => {
        // Convert the date from DD/MM/YYYY to YYYY-MM-DD
        const dateParts = values.date.split('/');
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

        const updatedValues = {
            sender: values.sender,
            recipient: values.recipient,
            value: values.value,
            isExpense: values.isExpense,
            category: categorySelected.id,
            date: formattedDate,
            status: values.status,
        }

        transactionService.updateTransaction(selectedTransaction.transactionId, updatedValues)
            .then(() => {
                Notification("Transação atualizada com sucesso", "success");
                setOpenEditTransaction(false);
                setSelectedTransaction(null);
                formik.resetForm();
                setSelectedDate(null);
                refetchUserData();
            })
            .catch((error: any) => {
                Notification("Erro ao atualizar transação", "error");
            });
    };

    const handleToggleTransactionStatus = () => {
        setShowPendingTransactions(!showPendingTransactions);
    };

    const rowStyle = (status: string) => ({
        opacity: status === "PENDING" ? 0.8 : 1,
        backgroundColor: status === "PENDING" && theme.COLORS.YELLOW,
    });

    const cellStyle = { fontSize: '1.0rem' };

    useEffect(() => {
        refetchUserData();
    }, []);

    return (
        <>
            <Box sx={{ display: "flex", flex: 1, flexDirection: "row", alignItems: "center" }}>
                <Button
                    sx={{ color: theme.COLORS.PURPLE3 }}
                    onClick={handleToggleTransactionStatus}
                >
                    <FilterListIcon />
                    <Typography sx={{ fontSize: "0.8pc", marginLeft: "0.5rem", marginTop: "4px" }}>
                        {showPendingTransactions ? "Esconder pendentes" : "Exibir pendentes"}
                    </Typography>
                </Button>
                <Button sx={{ color: theme.COLORS.PURPLE3, marginLeft: "auto" }}
                    onClick={() => setOpenRegisterTransaction(true)}>
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
                                <StyledTableCell>Remetente</StyledTableCell>
                                <StyledTableCell>Destinatário</StyledTableCell>
                                <StyledTableCell>Data</StyledTableCell>
                                <StyledTableCell>Valor</StyledTableCell>
                                <StyledTableCell>Tipo</StyledTableCell>
                                <StyledTableCell>Categoria</StyledTableCell>
                                <StyledTableCell>Ações</StyledTableCell>
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
                                transactions
                                    .filter((transaction) =>
                                        showPendingTransactions || transaction.status === 'COMPLETE'
                                    )
                                    .map((transaction: any) => (
                                        <TableRow
                                            key={transaction.transactionId}
                                            style={{
                                                ...rowStyle(transaction.status),
                                                backgroundColor: transaction.status === "PENDING" ? theme.COLORS.GRAY5 : undefined,
                                            }}
                                        >
                                            <TableCell sx={cellStyle}>{transaction.sender}</TableCell>
                                            <TableCell sx={cellStyle}>{transaction.recipient}</TableCell>
                                            <TableCell sx={cellStyle}>{formatDateBr(transaction.date) || 'Sem data'}</TableCell>
                                            <TableCell sx={cellStyle}>{formatCurrencyBR(transaction.value)}</TableCell>
                                            <TableCell sx={cellStyle}>
                                                <StyledStatus status={(() => {
                                                    if (transaction.isGoalContribution) {
                                                        return "Contribuição"
                                                    } else if (transaction.isExpense) {
                                                        return "Despesa";
                                                    } else {
                                                        return "Receita";
                                                    }
                                                })()} />
                                            </TableCell>
                                            <TableCell sx={cellStyle}>{transaction.category.name}</TableCell>
                                            <TableCell sx={cellStyle}>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <IconButton
                                                        onClick={() => handleEditTransaction(transaction)}
                                                        sx={{
                                                            color: theme.COLORS.PURPLE3,
                                                            '&:hover': {
                                                                color: theme.COLORS.BLUE
                                                            }
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleDeleteTransaction(transaction.transactionId)}
                                                        sx={{
                                                            color: theme.COLORS.PURPLE3,
                                                            '&:hover': {
                                                                color: theme.COLORS.RED
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>

                                        </TableRow>
                                    )
                                    )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box >

            <DefaultModal
                title='Adicionar Transação'
                isOpen={openRegisterTransaction}
                onClose={handleCloseModal}
                onOpen={() => setOpenRegisterTransaction(true)}
                children={
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem',
                            width: '90%',
                            maxWidth: 600,
                            padding: '1rem',
                            margin: '0 auto'
                        }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "1rem",
                                width: "100%",
                                justifyContent: "space-between",
                            }}>
                            {/* divisão da esquerda */}
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                                width: "100%",
                                justifyContent: "start",
                                alignItems: "center"
                            }}>
                                {/* quem manda */}
                                <GenericTextField<string>
                                    label="Remetente"
                                    name="sender"
                                    value={formik.values.sender}
                                    onChange={formik.handleChange}
                                    error={!!formik.errors.sender}
                                    helperText={formik.errors.sender}
                                    props={{
                                        fullWidth: true,
                                        InputProps: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                                {/* quem recebe */}
                                <GenericTextField<string>
                                    label="Recebedor"
                                    name="recipient"
                                    value={formik.values.recipient}
                                    onChange={formik.handleChange}
                                    error={!!formik.errors.recipient}
                                    helperText={formik.errors.recipient}
                                    props={{
                                        fullWidth: true,
                                        InputProps: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                                {/* seletor de data da transacao */}
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    adapterLocale="pt-br"
                                >
                                    <FormControl
                                        error={Boolean(getIn(formik.touched, 'date') && getIn(formik.errors, 'date'))}
                                        fullWidth
                                    >
                                        <DateField
                                            FormHelperTextProps={{ style: { margin: '1px 10px -5px', color: theme.COLORS.RED } }}
                                            helperText={getIn(formik.touched, 'date') && getIn(formik.errors, 'date')}
                                            size="small"
                                            variant="outlined"
                                            label="Data"
                                            value={selectedDate}
                                            format="DD/MM/YYYY"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => setDatePickerOpen(true)}
                                                            edge="end"
                                                        >
                                                            <CalendarMonthIcon sx={{ color: theme.COLORS.PURPLE3 }} />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            onChange={(event) =>
                                                handleDateChange(event)
                                            }
                                        />
                                        <DataPicker
                                            isOpen={datePickerOpen}
                                            onClose={() =>
                                                setDatePickerOpen(false)
                                            }
                                            onOpen={() =>
                                                setDatePickerOpen(true)
                                            }
                                            title="Escolher Data"
                                            initialDate={selectedDate}
                                            setInitialDate={
                                                handleDateChange
                                            }
                                            typeOfDatePicker="data"
                                        />
                                    </FormControl>
                                </LocalizationProvider>

                            </Box>
                            <Divider orientation="vertical" flexItem />
                            {/* divisão da direita */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1rem",
                                    width: "100%"
                                }}
                            >
                                <GenericTextField<number>
                                    label="Valor"
                                    name="value"
                                    value={formik.values.value}
                                    onChange={formik.handleChange}
                                    error={!!formik.errors.value}
                                    helperText={formik.errors.value}
                                    style={{ width: "100%" }}
                                    small
                                    props={{
                                        InputProps: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                                <CustomSelect
                                    label="Tipo de Transação"
                                    name="isExpense"
                                    value={isExpenseState}
                                    onChange={(e) => {
                                        const response = e.target.value;
                                        setIsExpenseState(response);
                                        formik.setFieldValue('isExpense', response);
                                    }}
                                    options={options}
                                    error={Boolean(getIn(formik.touched, "isExpense") && getIn(formik.errors, "isExpense"))}
                                    helperText={getIn(formik.touched, "isExpense") && getIn(formik.errors, "isExpense")}
                                    placeholder="Selecione o tipo"
                                    style={{ width: "100%" }}
                                />
                                <CustomSelect
                                    label="Categoria"
                                    name="category"
                                    value={categorySelected || ""}
                                    onChange={(e) => {
                                        const category = e.target.value;
                                        setCategorySelected(category);
                                        formik.setFieldValue('category', category.categoryId);
                                    }}
                                    options={categories.map((option: any) => ({ value: option.id, label: option.name }))}
                                    error={Boolean(getIn(formik.touched, "category") && getIn(formik.errors, "category"))}
                                    helperText={getIn(formik.touched, "category") && getIn(formik.errors, "category")}
                                    loading={isLoading}
                                    placeholder="Selecione a categoria"
                                    style={{ width: "100%" }}
                                />
                                <CustomSelect
                                    label="Status"
                                    name="status"
                                    value={formik.values.status || ""}
                                    onChange={(e) => {
                                        formik.setFieldValue('status', e.target.value);
                                    }}
                                    options={[
                                        { value: 'PENDING', label: 'PENDING' },
                                        { value: 'COMPLETE', label: 'COMPLETE' },
                                    ]}
                                    error={Boolean(getIn(formik.touched, "status") && getIn(formik.errors, "status"))}
                                    helperText={getIn(formik.touched, "status") && getIn(formik.errors, "status")}
                                    placeholder="Selecione o status"
                                    style={{ width: "100%" }}
                                />
                            </Box>
                        </Box>

                        {/* footer do modal */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "1rem",
                                width: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Button
                                variant='contained'
                                sx={{
                                    backgroundColor: theme.COLORS.PURPLE3,
                                    color: theme.COLORS.WHITE,
                                    width: "100px"
                                }}
                                onClick={() => handleCloseModal()}
                            >
                                CANCELAR
                            </Button>
                            <Button type='submit' onClick={() => formik.handleSubmit()} variant='contained' sx={{ backgroundColor: theme.COLORS.PURPLE3, color: theme.COLORS.WHITE, width: "100px" }}>
                                Salvar
                            </Button>
                        </Box>
                    </Box>
                }
            />

            <DefaultModal
                title='Editar Transação'
                isOpen={openEditTransaction}
                onClose={() => {
                    setOpenEditTransaction(false);
                    setSelectedTransaction(null);
                    formik.resetForm();
                }}
                onOpen={() => setOpenEditTransaction(true)}
                children={
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '90%', maxWidth: 600, padding: '1rem', margin: '0 auto' }}>
                        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem", width: "100%", justifyContent: "space-between", }}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                <GenericTextField<string>
                                    label="Remetente"
                                    name="sender"
                                    value={formik.values.sender}
                                    onChange={formik.handleChange}
                                    error={!!formik.errors.sender}
                                    helperText={formik.errors.sender}
                                    props={{
                                        fullWidth: true,
                                        InputProps: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                                <GenericTextField<string>
                                    label="Recebedor"
                                    name="recipient"
                                    value={formik.values.recipient}
                                    onChange={formik.handleChange}
                                    error={!!formik.errors.recipient}
                                    helperText={formik.errors.recipient}
                                    props={{
                                        fullWidth: true,
                                        InputProps: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    adapterLocale="pt-br"
                                >
                                    <FormControl
                                        error={Boolean(
                                            getIn(
                                                formik.errors,
                                                'date'
                                            )
                                        )}
                                        fullWidth
                                    >
                                        <DateField
                                            size="small"
                                            variant="outlined"
                                            label="Data"
                                            value={selectedDate}
                                            format="DD/MM/YYYY"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => setDatePickerOpen(true)}
                                                            edge="end"
                                                        >
                                                            <CalendarMonthIcon sx={{ color: theme.COLORS.PURPLE3 }} />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            onChange={(event) =>
                                                handleDateChange(event)
                                            }
                                            FormHelperTextProps={{
                                                style: {
                                                    margin: '1px 10px -5px '
                                                }
                                            }}
                                        />
                                        <DataPicker
                                            isOpen={datePickerOpen}
                                            onClose={() =>
                                                setDatePickerOpen(false)
                                            }
                                            onOpen={() =>
                                                setDatePickerOpen(true)
                                            }
                                            title="Escolher Data"
                                            initialDate={selectedDate}
                                            setInitialDate={
                                                handleDateChange
                                            }
                                            typeOfDatePicker="data"
                                        />
                                    </FormControl>
                                </LocalizationProvider>
                            </Box>
                            <Divider orientation="vertical" flexItem />
                            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
                                <Box sx={{ display: "flex", flexDirection: "row", gap: "0.7rem", width: "100%", justifyContent: "center" }}>
                                    <GenericTextField<number>
                                        label="Valor"
                                        name="value"
                                        value={formik.values.value}
                                        onChange={formik.handleChange}
                                        error={!!formik.errors.value}
                                        helperText={formik.errors.value}
                                        style={{ width: 110 }}
                                        small
                                        props={{
                                            InputProps: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />

                                    <TextField
                                        value={isExpenseState}
                                        onChange={(e: any) => {
                                            const response = e.target.value;
                                            setIsExpenseState(response);
                                            formik.setFieldValue('isExpense', response);
                                        }}
                                        id="outlined-select-state"
                                        margin="none"
                                        select
                                        label="Tipo de Transação"
                                        size="small"
                                        style={{ width: 130 }}
                                        name="isExpense"
                                        error={Boolean(getIn(formik.errors, "isExpense"))}
                                        helperText={getIn(formik.errors, "isExpense")}
                                        SelectProps={{
                                            MenuProps: {
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 100,
                                                    },
                                                },
                                            },
                                            sx: {
                                                textAlign: 'left',
                                                '.MuiSelect-select': {
                                                    textAlign: 'left',
                                                },
                                            },
                                        }}
                                        FormHelperTextProps={{
                                            style: {
                                                margin: '1px 10px -5px',
                                            },
                                        }}
                                    >
                                        {options.map((option: any) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>

                                <TextField
                                    value={categorySelected}
                                    onChange={(e: any) => {
                                        const category = e.target.value;
                                        setCategorySelected(category);
                                        formik.setFieldValue('category', category.categoryId);
                                    }}
                                    id="outlined-select-state"
                                    margin="none"
                                    select
                                    label="Categoria"
                                    size="small"
                                    style={{ width: "100%" }}
                                    name="category"
                                    error={Boolean(getIn(formik.errors, "category"))}
                                    helperText={getIn(formik.errors, "category")}
                                    SelectProps={{
                                        MenuProps: {
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 100,
                                                },
                                            },
                                        },
                                        sx: {
                                            textAlign: 'left',
                                            '.MuiSelect-select': {
                                                textAlign: 'left',
                                            },
                                        },
                                    }}
                                    FormHelperTextProps={{
                                        style: {
                                            margin: '1px 10px -5px',
                                        },
                                    }}
                                >
                                    {isLoading ? (
                                        <MenuItem disabled sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <CircularProgress color="inherit" size={20} />
                                        </MenuItem>
                                    ) : (
                                        categories.map((option: any) => (
                                            <MenuItem
                                                key={option.id}
                                                value={option}
                                                selected={categorySelected?.id === option.id} // Add selected prop for comparison
                                            >
                                                {String(option.name)}
                                            </MenuItem>
                                        ))
                                    )}
                                </TextField>

                                <TextField
                                    value={formik.values.status}
                                    onChange={(e: any) => {
                                        formik.setFieldValue('status', e.target.value);
                                    }}
                                    id="outlined-select-status"
                                    margin="none"
                                    select
                                    label="Status"
                                    size="small"
                                    style={{ width: "100%" }}
                                    name="status"
                                    error={Boolean(getIn(formik.errors, "status"))}
                                    helperText={getIn(formik.errors, "status")}
                                    SelectProps={{
                                        MenuProps: {
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 100,
                                                },
                                            },
                                        },
                                        sx: {
                                            textAlign: 'left',
                                            '.MuiSelect-select': {
                                                textAlign: 'left',
                                            },
                                        },
                                    }}
                                    FormHelperTextProps={{
                                        style: {
                                            margin: '1px 10px -5px',
                                        },
                                    }}
                                >
                                    <MenuItem value="PENDING">PENDING</MenuItem>
                                    <MenuItem value="COMPLETE">COMPLETE</MenuItem>
                                </TextField>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem", width: "100%", justifyContent: "center", alignItems: "center", }}>
                            <Button
                                variant='contained'
                                sx={{ backgroundColor: theme.COLORS.PURPLE3, color: theme.COLORS.WHITE, width: "100px" }}
                                onClick={() => {
                                    setOpenEditTransaction(false);
                                    setSelectedTransaction(null);
                                    formik.resetForm();
                                }}
                            >
                                CANCELAR
                            </Button>
                            <Button
                                type='submit'
                                onClick={() => handleUpdateTransaction(formik.values)}
                                variant='contained'
                                sx={{ backgroundColor: theme.COLORS.PURPLE3, color: theme.COLORS.WHITE, width: "100px" }}
                            >
                                ATUALIZAR
                            </Button>
                        </Box>
                    </Box>
                }
            />
        </>
    )
}

export default Transaction