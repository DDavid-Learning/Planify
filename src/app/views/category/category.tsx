import React, { useState } from 'react'
import { Container, Content } from '../styles'
import { Box, Button, CircularProgress, Divider, Icon, IconButton, InputAdornment, Typography } from '@mui/material'
import theme from '../../../core/theme/theme'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import DefaultModal from '../../components/defaultModal/defaultModal';
import { useFormik } from 'formik';
import GenericTextField from '../../components/genericTextField/genericTextField';
import CategoryIcon from '@mui/icons-material/Category';
import { useAuth } from '../../../core/context/auth/useAuth';
import { categoryService } from '../../../core/services/category/categoryService';
import { Notification } from '../../components/toastNotification/toastNotification';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../../core/services/api/userService';
import { Chart } from 'react-google-charts';
import { RegisterCategory } from '../../../core/utils/validations';



const Category = () => {
    const [openRegisterCategory, setOpenRegisterCategory] = useState(false);
    const userID = useAuth().userId;
    

    const { data, isLoading, refetch, } = useQuery({
        queryKey: ['category', userID],
        queryFn: () => userService.detailsUser(userID!),
        enabled: !!userID,
    });

    const dataCharts = [
        ['Categoria', 'Valor'],
        ['INVESTIMENTO', 700],
        ['LAZER', 300],
        ['ESTUDO', 300],
        ['TRABALHO', 200],
    ];
    const COLORS = ['#6E34B8', '#800080', '#5B259F', '#4B0082'];

    const options = {
        title: 'Gastos por categoria',
        pieHole: 0.7,
        colors: COLORS,
        legend: { position: 'bottom' },
        chartArea: { width: '90%', height: '80%' },
    };

    const options2 = {
        title: 'Transações por categoria',
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
                Notification("Categoria adicionada com sucesso", "success")
                formik.setFieldValue("name", "")
                setOpenRegisterCategory(false)
                refetch();
            }).catch((error: any) => {
                Notification("Erro ao adicionar categoria", "error")
            })
        },
    });

    return (
        <Container>
            <Content>
                <Box sx={{ display: "flex", flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Button sx={{ color: theme.COLORS.PURPLE3 }}>
                        <CalendarMonthIcon />
                        <Typography sx={{ fontSize: "0.8pc", marginLeft: "0.5rem", marginTop: "4px" }}>Filtrar por data</Typography>
                    </Button>
                    <Button sx={{ color: theme.COLORS.PURPLE3 }} onClick={() => setOpenRegisterCategory(true)}>
                        <AddIcon />
                        <Typography sx={{ fontSize: "0.8pc", marginLeft: "0.5rem", marginTop: "4px" }}>Adicionar categoria</Typography>
                    </Button>
                </Box>
                <Divider />
                <Box sx={{ display: "flex", flex: 8, flexDirection: "row" }}>
                    <Box sx={{ display: "flex", flex: 2, width: "100%", borderColor: theme.COLORS.PURPLE3, padding: "1rem" }}>
                        <Box sx={{ display: "flex", flex: 1, border: "2px solid", borderColor: theme.COLORS.PURPLE3, borderRadius: "10px", flexDirection: "column" }}>
                            <Typography sx={{ fontWeight: "bold", textAlign: "center", width: "100%", padding: "0.5rem", color: theme.COLORS.PURPLE3 }}>Categorias Cadastradas</Typography>
                            <Box sx={{ padding: "0.5rem", gap: "0.5rem", display: "flex", flexDirection: "column", flex: 1 }}>

                                {isLoading ? (
                                    <Box sx={{ display: "flex", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                        <CircularProgress />
                                    </Box>
                                ) : data?.categories.length === 0 ? (
                                    <Box sx={{ display: "flex", height: "100%", width: "100%",flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "1rem", justifyItems: "center" }}> 
                                        <CancelRoundedIcon sx={{  color: theme.COLORS.RED, fontSize: "3rem" }} />
                                        <Typography sx={{ fontSize: "0.8pc", color: theme.COLORS.PURPLE3 }}>Nenhuma categoria cadastrada</Typography>
                                    </Box>
                                ) :
                                    (data?.categories.map((item: any, index: number) =>
                                        <Box sx={{
                                            display: "flex", flexDirection: "row", gap: "1rem", width: "100%", justifyContent: "space-between",
                                            alignItems: "center", border: "2px solid", borderColor: theme.COLORS.PURPLE4, borderRadius: "10px",
                                            backgroundColor: theme.COLORS.GRAY7
                                        }} key={index}>
                                            <Typography sx={{ fontWeight: "bold", color: theme.COLORS.PURPLE3, marginLeft: "10px" }}>{item.name}</Typography>
                                            <Box>
                                                <IconButton sx={{ backgroundColor: theme.COLORS.GRAY7, color: theme.COLORS.PURPLE3, ":hover": { backgroundColor: theme.COLORS.PURPLE2 } }}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton sx={{ backgroundColor: theme.COLORS.GRAY7, color: theme.COLORS.RED, ":hover": { backgroundColor: theme.COLORS.PURPLE2 } }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>


                                        </Box>)
                                    )
                                }
                            </Box>
                        </Box>

                    </Box>
                    <Box sx={{ display: "flex", flex: 7, }}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "60%" }}>
                            <Chart
                                chartType="PieChart"
                                data={dataCharts}
                                options={options}
                                width="100%"
                                height="100%"
                            />
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "60%" }}>
                            <Chart
                                chartType="PieChart"
                                data={dataCharts}
                                options={options2}
                                width="100%"
                                height="100%"
                            />
                        </Box>
                    </Box>
                </Box>
            </Content>


            <DefaultModal
                title='Adicionar Categoria'
                isOpen={openRegisterCategory}
                onClose={() => setOpenRegisterCategory(false)}
                onOpen={() => setOpenRegisterCategory(true)}
                children={

                    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", padding: "1rem" }}>


                        <GenericTextField<string>
                            label="Nome"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={!!formik.errors.name}
                            helperText={formik.errors.name}
                            props={{
                                fullWidth: true,
                                InputProps: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <CategoryIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem", width: "100%", justifyContent: "center", alignItems: "center", }}>

                            <Button variant='contained' sx={{ backgroundColor: theme.COLORS.PURPLE3, color: theme.COLORS.WHITE, width: "100px" }} onClick={() => setOpenRegisterCategory(false)}>
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

export default Category