import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ITransaction } from '../../../app/views/transaction/transaction';
import { userService } from '../../services/api/userService';
import { useAuth } from '../auth/useAuth';

export interface ICategory {
  name: string;
}

interface AppContextProps {
  exampleState: string;
  setExampleState: React.Dispatch<React.SetStateAction<string>>;
  transactions: ITransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<ITransaction[]>>;
  categories: ICategory[];
  setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
  refetchUserData: () => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [exampleState, setExampleState] = useState<string>('default value');
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const userID = useAuth().userId;

  const { data, isLoading: queryLoading, refetch } = useQuery({
    queryKey: ['transaction', userID],
    queryFn: () => userService.detailsUser(userID!),
    enabled: !!userID,
  });

  const refetchUserData = () => {
    refetch();
  };

  useEffect(() => {
    if (data) {
      setTransactions(data.transactions);
      setCategories(data.categories);
    }
  }, [data]);

  return (
    <AppContext.Provider value={{ exampleState, setExampleState, transactions, setTransactions, categories, setCategories, refetchUserData, isLoading: queryLoading }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export { AppProvider, useAppContext };