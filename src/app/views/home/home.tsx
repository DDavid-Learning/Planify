import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br'; // Importa a localização brasileira
import localeData from 'dayjs/plugin/localeData';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Box, Typography, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ITransaction } from '../transaction/transaction';
import { useAppContext } from '../../../core/context/user/userContext';

// Ativa plugins no Dayjs
dayjs.extend(localeData);
dayjs.extend(customParseFormat);
dayjs.locale('pt-br'); // Define a localização como pt-br

type Period = 'day' | 'week' | 'month' | 'year';

const filterTransactionsByDay = (
  transactions: ITransaction[],
  date: Dayjs
) => {
  return transactions.filter((transaction) =>
    dayjs(transaction.date).isSame(date, 'day')
  );
};

const filterTransactionsByMonth = (
  transactions: ITransaction[],
  month: Dayjs
) => {
  return transactions.filter((transaction) =>
    dayjs(transaction.date).isSame(month, 'month')
  );
};

const Home = () => {
  const { transactions, refetchUserData } = useAppContext();
  const [selectedDay, setSelectedDay] = useState<Dayjs | null>(dayjs());
  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(dayjs());
  const [chartData, setChartData] = useState<Record<Period, [string, number | string][]>>({
    day: [['Tipo', 'Valor']],
    week: [['Tipo', 'Valor']],
    month: [['Tipo', 'Valor']],
    year: [['Tipo', 'Valor']],
  });

  const updateChartData = (period: Period) => {
    const filteredTransactions =
      period === 'day' && selectedDay
        ? filterTransactionsByDay(transactions, selectedDay)
        : period === 'month' && selectedMonth
          ? filterTransactionsByMonth(transactions, selectedMonth)
          : transactions.filter((transaction) =>
            dayjs(transaction.date).isSame(dayjs(), period)
          );

    let totalExpenses = 0;
    let totalIncomes = 0;

    filteredTransactions.forEach((transaction) => {
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
    refetchUserData();
  }, []);

  useEffect(() => {
    updateChartData('day');
    updateChartData('month');
    updateChartData('week');
    updateChartData('year');
  }, [transactions, selectedDay, selectedMonth]);

  const options = (title: string) => ({
    title,
    pieHole: 0.5,
    colors: ['#FF6347', '#32CD32'],
    legend: { position: 'bottom' },
    chartArea: { width: '90%', height: '80%' },
  });

  function returnPeriod(period: Period): String {
    switch (period) {
      case 'day':
        return 'Dia';
      case 'week':
        return 'Semana';
      case 'month':
        return 'Mês';
      case 'year':
        return 'Ano';
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box
        sx={{
          padding: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '32px',
        }}
      >
        {(['day', 'week', 'month', 'year'] as Period[]).map((period) => (
          <Box key={period} sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ marginBottom: '16px' }}>
              {returnPeriod(period)}
            </Typography>

            {period === 'day' && (
              <DatePicker
                label="Escolha um dia"
                value={selectedDay}
                onChange={(newValue) => setSelectedDay(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
                format="DD/MM/YYYY" // Formato brasileiro
              />
            )}

            {period === 'month' && (
              <DatePicker
                views={['year', 'month']}
                label="Escolha um mês"
                value={selectedMonth}
                onChange={(newValue) => setSelectedMonth(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
                format="MM/YYYY" // Formato brasileiro para mês e ano
              />
            )}

            {chartData[period].length > 0 ? (
              <Chart
                chartType="PieChart"
                data={chartData[period]}
                options={options(`Despesas e Receitas (${returnPeriod(period)})`)}
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
    </LocalizationProvider>
  );
};

export default Home;
