import { useEffect, useMemo, useState } from 'react';
import { Chart } from 'react-google-charts';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import localeData from 'dayjs/plugin/localeData';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Box, Typography, Button, Card, CardContent, CardHeader, Divider } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { useAppContext } from '../../../core/context/user/userContext';
import { userService } from '../../../core/services/api/userService';

dayjs.extend(localeData);
dayjs.extend(customParseFormat);
dayjs.locale('pt-br');

type Period = 'day' | 'week' | 'month' | 'year';

const Home = () => {
  const { transactions, refetchUserData } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [chartData, setChartData] = useState<Record<Period, [string, number | string][]>>({
    day: [['Tipo', 'Valor']],
    week: [['Tipo', 'Valor']],
    month: [['Tipo', 'Valor']],
    year: [['Tipo', 'Valor']],
  });

  // calcula despesas, receitas e saldo geral
  const expenses = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.status === 'COMPLETE' && transaction.isExpense)
        .reduce((acc, transaction) => acc + transaction.value, 0),
    [transactions]
  );

  const incomes = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.status === 'COMPLETE' && !transaction.isExpense)
        .reduce((acc, transaction) => acc + transaction.value, 0),
    [transactions]
  );

  const balance = useMemo(() => incomes - expenses, [incomes, expenses]);

  // exportar o csv de um periodo
  const handleDownloadCsv = async () => {
    try {
      if (startDate && endDate) {
        const response = await userService.exportTransactions('csv', startDate, endDate);
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'transactions.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert('Por favor, selecione as datas inicial e final.');
      }
    } catch (error) {
      console.error('Erro ao baixar CSV:', error);
    }
  };

  // filtra as transacoes pros graficos
  const updateChartData = (period: Period) => {
    const date = selectedDate || dayjs();

    const filteredTransactions =
      period === 'day'
        ? transactions.filter((transaction) => dayjs(transaction.date).isSame(date, 'day'))
        : period === 'week'
          ? transactions.filter((transaction) => dayjs(transaction.date).isSame(date, 'week'))
          : period === 'month'
            ? transactions.filter((transaction) => dayjs(transaction.date).isSame(date, 'month'))
            : transactions.filter((transaction) => dayjs(transaction.date).isSame(date, 'year'));

    let totalExpenses = 0;
    let totalIncomes = 0;

    filteredTransactions
      .filter((transaction) => transaction.status === 'COMPLETE')
      .forEach((transaction) => {
        if (transaction.isExpense) {
          totalExpenses += transaction.value;
        } else {
          totalIncomes += transaction.value;
        }
      });

    setChartData((prev) => ({
      ...prev,
      [period]:
        totalExpenses === 0 && totalIncomes === 0
          ? [['Tipo', 'Valor']]
          : [
            ['Tipo', 'Valor'],
            ['Despesas', totalExpenses],
            ['Receitas', totalIncomes],
          ],
    }));
  };

  useEffect(() => {
    refetchUserData();
  }, []);

  useEffect(() => {
    updateChartData('day');
    updateChartData('week');
    updateChartData('month');
    updateChartData('year');
  }, [transactions, selectedDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      {/* Seletor de Data Central */}
      <Box sx={{ textAlign: 'center', marginBottom: '16px' }}>
        <DatePicker
          label="Escolha uma data"
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          slotProps={{ textField: { fullWidth: true } }}
          format="DD/MM/YYYY"
        />
      </Box>

      {/* Gráficos */}
      <Card sx={{ marginBottom: '15px', boxShadow: 3, padding: '16px' }}>
        <CardContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '32px',
            }}
          >
            {(['day', 'week', 'month', 'year'] as Period[]).map((period) => (
              <Box key={period} sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ marginBottom: '16px' }}>
                  {period === 'day' ? 'Dia' : period === 'week' ? 'Semana' : period === 'month' ? 'Mês' : 'Ano'}
                </Typography>
                {chartData[period].length > 1 ? (
                  <Chart
                    chartType="PieChart"
                    data={chartData[period]}
                    options={{
                      title: `Despesas e Receitas (${period === 'day' ? 'Dia' : period === 'week' ? 'Semana' : period === 'month' ? 'Mês' : 'Ano'})`,
                      pieHole: 0.5,
                      colors: ['#FF6347', '#32CD32'],
                      legend: { position: 'bottom' },
                      chartArea: { width: '90%', height: '80%' },
                    }}
                    width="100%"
                    height="300px"
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '300px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h6" color="textSecondary">
                      Nenhuma transação nesse período
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Saldo atual */}
      <Card sx={{ marginBottom: '16px', boxShadow: 3, borderRadius: '12px' }}>
        <CardContent sx={{ padding: '24px' }}>
          <Typography variant="h6" component="div" sx={{ marginBottom: '16px', fontWeight: 'bold' }}>
            Saldo da Conta
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body1" color="textSecondary">
              Entradas
            </Typography>
            <Typography variant="h6" sx={{ color: 'green', fontWeight: 'bold' }}>
              R$ {incomes.toFixed(2)}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body1" color="textSecondary">
              Saídas
            </Typography>
            <Typography variant="h6" sx={{ color: 'red', fontWeight: 'bold' }}>
              R$ {expenses.toFixed(2)}
            </Typography>
          </Box>

          <Divider sx={{ marginY: '16px' }} />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 'bold' }}>
              Saldo
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: balance >= 0 ? 'green' : 'red',
                fontWeight: 'bold',
              }}
            >
              R$ {balance.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Baixar Transações */}
      <Card sx={{ marginBottom: '15px', boxShadow: 3, padding: '16px' }}>
        <CardHeader title="Exportar transações para CSV" titleTypographyProps={{ variant: 'h5' }} />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '16px', flexDirection: { xs: 'column', sm: 'row' } }}>
            <DatePicker
              label="Data Inicial"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
              format="DD/MM/YYYY"
            />
            <DatePicker
              label="Data Final"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
              format="DD/MM/YYYY"
            />
          </Box>
          <Box sx={{ textAlign: 'center', marginTop: '16px' }}>
            <Button variant="contained" onClick={handleDownloadCsv}>
              Baixar CSV
            </Button>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default Home;
