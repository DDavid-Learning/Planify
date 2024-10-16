import React, { useEffect, useState } from 'react'
import { Container, Content, StyledTableCell, StyledTableHead } from '../styles'
import { Box, Button, CircularProgress, Divider, FormControl, IconButton, InputAdornment, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import theme from '../../../core/theme/theme';
import DefaultModal from '../../components/defaultModal/defaultModal';
import GenericTextField from '../../components/genericTextField/genericTextField';
import { getIn, useFormik } from 'formik';
import { RegisterTransaction } from '../../../core/utils/validations';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../../core/services/api/userService';
import { useAuth } from '../../../core/context/auth/useAuth';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import DataPicker from '../../components/datePicker/datePicker';
import { Notification } from '../../components/toastNotification/toastNotification';
import { transactionService } from '../../../core/services/transaction/transactionService';
import StyledStatus from '../../components/styledStatus/styledStatus';
import { formatCurrencyBR, formatDateBr } from '../../../core/utils/globalFunctions';
import { useAppContext } from '../../../core/context/user/userContext';
export interface ITransaction {
    sender: string;
    recipient: string;
    value: number;
    isExpense: boolean;
    user: string;
    category: string;
    date: string;
}

const options = [
    { label: 'Saída', value: true },
    { label: 'Entrada', value: false },
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
    };

    const formik = useFormik({
        initialValues,
        validationSchema: RegisterTransaction,
        validateOnChange: false,
        onSubmit: (values) => {
            const newValues = {
                sender: formik.values.sender,
                recipient: formik.values.recipient,
                value: formik.values.value,
                isExpense: formik.values.isExpense,
                user: formik.values.user,
                category: categorySelected.id,
                date: formik.values.date
            }
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

    useEffect(() => {
        refetchUserData();
    }, []);

    return (
        <Container>
            <Content>
                <Box sx={{ display: "flex", flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Button sx={{ color: theme.COLORS.PURPLE3 }}>
                        <FilterListIcon />
                        <Typography sx={{ fontSize: "0.8pc", marginLeft: "0.5rem", marginTop: "4px" }}>Filtros</Typography>
                    </Button>
                    <Button sx={{ color: theme.COLORS.PURPLE3 }} onClick={() => setOpenRegisterTransaction(true)}>
                        <AddIcon />
                        <Typography sx={{ fontSize: "0.8pc", marginLeft: "0.5rem", marginTop: "4px" }}>Adicionar Transação</Typography>
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
                                </TableRow>
                            </StyledTableHead>
                            <TableBody>

                                {isLoading ? (<TableRow><TableCell colSpan={6}><CircularProgress color="inherit" size={20} /></TableCell></TableRow>) :
                                    (transactions.map((transaction: any) => (
                                        <TableRow key={transaction.transactionId}>
                                            <TableCell>{transaction.sender}</TableCell>
                                            <TableCell>{transaction.recipient}</TableCell>
                                            <TableCell>{formatDateBr(transaction.date) || 'Sem data'}</TableCell>
                                            <TableCell>{formatCurrencyBR(transaction.value)}</TableCell>
                                            <TableCell>
                                                <StyledStatus status={transaction.isExpense ? 'Saída' : 'Entrada'} />
                                            </TableCell>
                                            <TableCell>{transaction.category.name}</TableCell>
                                        </TableRow>
                                    )))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Content>
            <DefaultModal
                title='Adicionar Transação'
                isOpen={openRegisterTransaction}
                onClose={handleCloseModal}
                onOpen={() => setOpenRegisterTransaction(true)}
                children={

                    <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem", width: "100%", padding: "1rem" }}>
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
                                            <MenuItem key={option} value={option}>
                                                {(String(option.name))}
                                            </MenuItem>
                                        ))
                                    )}
                                </TextField>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem", width: "100%", justifyContent: "center", alignItems: "center", }}>

                            <Button variant='contained' sx={{ backgroundColor: theme.COLORS.PURPLE3, color: theme.COLORS.WHITE, width: "100px" }} onClick={() => handleCloseModal()}>
                                CANCELAR
                            </Button>
                            <Button type='submit' onClick={() => formik.handleSubmit()} variant='contained' sx={{ backgroundColor: theme.COLORS.PURPLE3, color: theme.COLORS.WHITE, width: "100px" }}>
                                Salvar
                            </Button>
                        </Box>
                    </Box>
                }
            />
        </Container>
    )
}

export default Transaction