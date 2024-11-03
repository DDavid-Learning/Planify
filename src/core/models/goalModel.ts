import { TCategoryResponse } from "./category";

export type TGoal = {
  name: string;
  targetAmount: number;
  targetDate: string;
  category: string;
};

export type TGoalResponse = {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  category: TCategoryResponse;
  transactions: any[];
  currentAmount: number;
};
