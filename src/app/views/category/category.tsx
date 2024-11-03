import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { useQuery } from '@tanstack/react-query';
import { Chart } from 'react-google-charts';
import { Box, Button, CircularProgress, Divider, IconButton, InputAdornment, Typography } from '@mui/material';
import { useFormik } from 'formik';

import theme from '../../../core/theme/theme';
import DefaultModal from '../../components/defaultModal/defaultModal';
import GenericTextField from '../../components/genericTextField/genericTextField';
import { useAuth } from '../../../core/context/auth/useAuth';
import { categoryService } from '../../../core/services/category/categoryService';
import { Notification } from '../../components/toastNotification/toastNotification';
import { userService } from '../../../core/services/api/userService';
import { RegisterCategory } from '../../../core/utils/validations';

const Category = () => {
    const [openRegisterCategory, setOpenRegisterCategory] = useState(false);
    const [expenseData, setExpenseData] = useState<[string, (string | number)][]>([['Categoria', 'Valor']]);
    const [incomeData, setIncomeData] = useState<[string, (string | number)][]>([['Categoria', 'Valor']]);

    const userID = useAuth().userId;

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['category', userID],
        queryFn: () => userService.detailsUser(userID!),
        enabled: !!userID,
    });

    useEffect(() => {
        if (data) {
            const expenseMap = new Map();
            const incomeMap = new Map();
            let totalExpenses = 0;
            let totalIncomes = 0;

            data.transactions.forEach((transaction: any) => {
                const categoryName = transaction.category.name;
                if (transaction.isExpense) {
                    totalExpenses += transaction.value;
                    expenseMap.set(categoryName, (expenseMap.get(categoryName) || 0) + transaction.value);
                } else {
                    totalIncomes += transaction.value;
                    incomeMap.set(categoryName, (incomeMap.get(categoryName) || 0) + transaction.value);
                }
            });

            const processData = (map: Map<string, number>, total: number) => {
                const resultArray: [string, number | string][] = [['Categoria', 'Valor']];
                let otherValue = 0;

                map.forEach((value, key) => {
                    if (value / total < 0.1) {
                        otherValue += value;
                    } else {
                        resultArray.push([key, value]);
                    }
                });

                if (otherValue > 0) {
                    resultArray.push(['Outros', otherValue]);
                }

                return resultArray;
            };

            setExpenseData(processData(expenseMap, totalExpenses));
            setIncomeData(processData(incomeMap, totalIncomes));
        }
    }, [data]);

    const COLORS = ['#6E34B8', '#800080', '#5B259F', '#4B0082'];

    const options = {
        title: 'Gastos',
        pieHole: 0.7,
        colors: COLORS,
        legend: { position: 'bottom' },
        chartArea: { width: '90%', height: '80%' },
    };

    const options2 = {
        title: 'Entrada',
        pieHole: 0.7,
        colors: COLORS,
        legend: { position: 'bottom' },
        chartArea: { width: '90%', height: '80%' },
    };

    const formik = useFormik({
        initialValues: {
            name: "",
        },
        validationSchema: RegisterCategory,
        validateOnChange: false,
        onSubmit: (values) => {
            categoryService.registerCategory(values.name, userID!).then((resp) => {
                Notification("Categoria adicionada com sucesso", "success");
                formik.setFieldValue("name", "");
                setOpenRegisterCategory(false);
                refetch();
            }).catch((error: any) => {
                Notification("Erro ao adicionar categoria", "error");
            });
        },
    });

    return (
        <>
            <Box sx={{ height: '100%' }}>
                <Box sx={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "end",
                }}>
                    <Button sx={{ color: theme.COLORS.PURPLE3 }} onClick={() => setOpenRegisterCategory(true)}>
                        <AddIcon />
                        <Typography sx={{ fontSize: "0.8pc", marginLeft: "0.5rem", marginTop: "4px" }}>Adicionar categoria</Typography>
                    </Button>
                </Box>
                <Divider />
                <Box sx={{
                    display: "flex",
                    flex: 8,
                    flexDirection: "row",
                    height: "80%",
                }}>
                    <Box sx={{
                        display: "flex",
                        flex: 2,
                        width: "100%",
                        height: "100%",
                        padding: "1rem",
                    }}>
                        <Box sx={{
                            display: "flex",
                            flex: 1,
                            border: "2px solid",
                            borderColor: theme.COLORS.PURPLE3,
                            borderRadius: "10px",
                            flexDirection: "column",
                        }}>
                            <Typography sx={{
                                fontWeight: "bold",
                                textAlign: "center",
                                width: "100%",
                                padding: "0.5rem",
                                color: theme.COLORS.PURPLE3
                            }}>
                                Categorias Cadastradas
                            </Typography>
                            <Box sx={{
                                padding: "0.5rem",
                                gap: "0.5rem",
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                                overflowY: "scroll",
                                overflowX: "hidden"
                            }}>
                                {isLoading ? (
                                    <Box sx={{ display: "flex", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                        <CircularProgress />
                                    </Box>
                                ) : data?.categories.length === 0 ? (
                                    <Box sx={{ display: "flex", height: "100%", width: "100%", flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "1rem", justifyItems: "center" }}>
                                        <CancelRoundedIcon sx={{ color: theme.COLORS.RED, fontSize: "3rem" }} />
                                        <Typography sx={{ fontSize: "0.8pc", color: theme.COLORS.PURPLE3 }}>Nenhuma categoria cadastrada</Typography>
                                    </Box>
                                ) :
                                    (data?.categories.map((item: any, index: number) =>
                                        <Box sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: "1rem",
                                            width: "100%",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            border: "2px solid",
                                            borderColor: theme.COLORS.GRAY5,
                                            borderRadius: "10px",
                                            backgroundColor: theme.COLORS.GRAY7
                                        }} key={index}>
                                            <Typography sx={{ color: theme.COLORS.BLACK }}>{item.name}</Typography>
                                        </Box>
                                    ))
                                }
                            </Box>
                        </Box>
                    </Box>

                    {/* gráficos */}
                    <Box sx={{ display: "flex", flex: 7, justifyContent: 'space-around' }}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Chart
                                chartType="PieChart"
                                data={expenseData}
                                options={options}
                                width="100%"
                                height="100%"
                            />
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Chart
                                chartType="PieChart"
                                data={incomeData}
                                options={options2}
                                width="100%"
                                height="100%"
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* cadastro de categoria */}
            <DefaultModal
                title='Adicionar Categoria'
                isOpen={openRegisterCategory}
                onClose={() => setOpenRegisterCategory(false)}
                onOpen={() => setOpenRegisterCategory(true)}
                children={
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        padding: 2
                    }}>
                        <GenericTextField<string>
                            label="Nome"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={!!formik.errors.name}
                            helperText={formik.errors.name}
                        />

                        {/* footer do modal */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "1rem",
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                variant='contained'
                                sx={{
                                    backgroundColor: theme.COLORS.PURPLE3,
                                    color: theme.COLORS.WHITE,
                                    width: "100px",
                                    textTransform: "none"
                                }}
                                onClick={() => setOpenRegisterCategory(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type='submit'
                                onClick={() => formik.handleSubmit()}
                                variant='contained'
                                sx={{
                                    backgroundColor: theme.COLORS.PURPLE3,
                                    color: theme.COLORS.WHITE,
                                    width: "100px",
                                    textTransform: "none"
                                }}>
                                Salvar
                            </Button>
                        </Box>
                    </Box>
                }
            />
        </>
    );
};

export default Category;