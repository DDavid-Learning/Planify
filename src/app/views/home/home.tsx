
import { Container, Content } from '../styles';
import { useAppContext } from '../../../core/context/user/userContext';
import { useEffect } from 'react';

const Home = () => {
  const { transactions, refetchUserData } = useAppContext();

  useEffect(() => {
    refetchUserData();
  }, []);

  return (
    <Container>
      <Content>

      </Content>
    </Container>
  );
};

export default Home;