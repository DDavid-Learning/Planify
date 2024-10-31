import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br'; // Importa a localização brasileira
import localeData from 'dayjs/plugin/localeData';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Box, Typography, Button, Card, CardContent, CardHeader } from '@mui/material';
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
  const [selectedDay, setSelectedDay] = useState<Dayjs | null>(dayjs());
  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(dayjs());
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [chartData, setChartData] = useState<Record<Period, [string, number | string][]>>({
    day: [['Tipo', 'Valor']],
    week: [['Tipo', 'Valor']],
    month: [['Tipo', 'Valor']],
    year: [['Tipo', 'Valor']],
  });

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

  useEffect(() => {
    refetchUserData();
  }, []);

  const updateChartData = (period: Period) => {
    const filteredTransactions =
      period === 'day' && selectedDay
        ? transactions.filter((transaction) =>
          dayjs(transaction.date).isSame(selectedDay, 'day')
        )
        : period === 'month' && selectedMonth
          ? transactions.filter((transaction) =>
            dayjs(transaction.date).isSame(selectedMonth, 'month')
          )
          : transactions.filter((transaction) =>
            dayjs(transaction.date).isSame(dayjs(), period)
          );

    let totalExpenses = 0;
    let totalIncomes = 0;

    filteredTransactions
      .filter((transaction) => transaction.status == "COMPLETE")
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
          ? []
          : [
            ['Tipo', 'Valor'],
            ['Despesas', totalExpenses],
            ['Receitas', totalIncomes],
          ],
    }));
  };



  useEffect(() => {
    updateChartData('day');
    updateChartData('month');
    updateChartData('week');
    updateChartData('year');
  }, [transactions, selectedDay, selectedMonth]);



  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      {/* Saldo atual */}
      <Card sx={{ marginBottom: '16px', boxShadow: 3 }}>
        <CardContent sx={{ textAlign: 'left' }}>
          {(() => {
            let totalExpenses = 0;
            let totalIncomes = 0;
            transactions
              .filter((transaction) => transaction.status === 'COMPLETE')
              .forEach((transaction) => {
                if (transaction.isExpense) {
                  totalExpenses += transaction.value;
                } else {
                  totalIncomes += transaction.value;
                }
              });
            const balance = totalIncomes - totalExpenses;

            return (
              <Typography variant="h6" component="div">
                <b style={{ fontSize: "22px" }}>Saldo:</b>{" "}
                <span style={{ color: 'green' }}>
                  {totalIncomes.toFixed(2)}
                </span> - <span style={{ color: 'red' }}>
                  {totalExpenses.toFixed(2)}
                </span> = <span style={{ color: balance >= 0 ? 'green' : 'red' }}>
                  <b style={{ fontSize: "22px" }}>R$ {balance.toFixed(2)}</b>
                </span>
              </Typography>
            );
          })()}
        </CardContent>
      </Card>

      {/* Gráficos */}
      <Card sx={{ marginBottom: '15px', boxShadow: 3, padding: '16px' }}>
        <CardContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '32px',
            }}
          >
            {(['day', 'week', 'month', 'year'] as Period[]).map((period) => (
              <Box key={period} sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ marginBottom: '16px' }}>
                  {period === 'day' ? 'Dia' : period === 'month' ? 'Mês' : period === 'week' ? 'Semana' : 'Ano'}
                </Typography>

                {period === 'day' && (
                  <DatePicker
                    label="Escolha um dia"
                    value={selectedDay}
                    onChange={(newValue) => setSelectedDay(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                    format="DD/MM/YYYY"
                  />
                )}

                {period === 'month' && (
                  <DatePicker
                    views={['year', 'month']}
                    label="Escolha um mês"
                    value={selectedMonth}
                    onChange={(newValue) => setSelectedMonth(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                    format="MM/YYYY"
                  />
                )}

                {chartData[period].length > 0 ? (
                  <Chart
                    chartType="PieChart"
                    data={chartData[period]}
                    options={{
                      title: `Despesas e Receitas (${period === 'day' ? 'Dia' : period === 'month' ? 'Mês' : period === 'week' ? 'Semana' : 'Ano'})`,
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

      {/* Baixar Transações */}
      <Card sx={{ marginBottom: '15px', boxShadow: 3, padding: '16px' }}> {/* Card para a seção de download */}
        <CardHeader title="Exportar transações para CSV" titleTypographyProps={{ variant: 'h5' }} />
        <CardContent> {/* Conteúdo dentro do Card */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '16px', flexDirection: { xs: 'column', sm: 'row' } }}> {/* Responsivo */}
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
          <Box sx={{ textAlign: 'center', marginTop: '16px' }}> {/* Centraliza o botão */}
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
