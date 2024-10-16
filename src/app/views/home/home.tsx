import { Container, Content } from '../styles';
import { useAppContext } from '../../../core/context/user/userContext';
import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

const Home = () => {
  const { transactions, refetchUserData } = useAppContext();

  const [chartData, setChartData] = useState<[string, number | string][]>([['Tipo', 'Valor']]);

  useEffect(() => {
    if (transactions.length > 0) {
      let totalExpenses = 0;
      let totalIncomes = 0;

      transactions.forEach((transaction: any) => {
        if (transaction.isExpense) {
          totalExpenses += transaction.value;
        } else {
          totalIncomes += transaction.value;
        }
      });

      setChartData([
        ['Tipo', 'Valor'],
        ['Despesas', totalExpenses],
        ['Receitas', totalIncomes],
      ]);
    }
  }, [transactions]);

  useEffect(() => {
    refetchUserData();
  }, []);

  const options = {
    title: 'Despesas e Receitas',
    pieHole: 0.7,
    colors: ['#FF6347', '#32CD32'],
    legend: { position: 'bottom' },
    chartArea: { width: '90%', height: '80%' },
  };

  return (
    <Container>
      <Content>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div style={{ width: '60%' }}>
            <Chart
              chartType="PieChart"
              data={chartData}
              options={options}
              width="100%"
              height="400px"
            />
          </div>
        </div>
      </Content>
    </Container>
  );
};

export default Home;