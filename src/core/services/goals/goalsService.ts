import { GET_GOAL, GOALS, MANAGE_GOAL } from "../../constants/constants";
import { TGoal } from "../../models/goalModel";
import { Api } from "../api/api";

const createGoal = async (goal: TGoal) => {
  try {
    const response = await Api.post(GOALS, goal);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllGoals = async () => {
  try {
    const response = await Api.get(GOALS);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getGoal = async (id: string) => {
  try {
    const response = await Api.get(GET_GOAL + `${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateGoal = async (id: string, value: number) => {
  try {
    const response = await Api.put(MANAGE_GOAL + `${id}`, { value: value });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GoalsService = {
  createGoal,
  getAllGoals,
  getGoal,
  updateGoal,
};
