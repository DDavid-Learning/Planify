import { Dayjs } from "dayjs";
import {
  DETAILS_USER,
  EDIT_USER,
  REGISTER_USER,
  DOWNLOAD_CSV,
  DOWNLOAD_PDF,
} from "../../constants/constants";
import { Api } from "./api";

const exportTransactions = async (
  type = "csv",
  startDate: Dayjs,
  endDate: Dayjs
) => {
  try {
    const response = await Api.get(DOWNLOAD_CSV, {
      params: {
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const rmvUser = async (token: string, userId?: string) => {
  try {
    const response = await Api.delete(EDIT_USER);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const editUser = async (
  userId: string,
  token: string,
  username?: string,
  email?: string,
  password?: string
) => {
  console.log(`Req: ${EDIT_USER + userId}`);
  try {
    const response = await Api.put(
      EDIT_USER,
      { username: username, email: email, password: password },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const response = await Api.post(REGISTER_USER, {
      username: username,
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const detailsUser = async (userId: string) => {
  try {
    const response = await Api.get(DETAILS_USER);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const userService = {
  registerUser,
  detailsUser,
  editUser,
  rmvUser,
  exportTransactions,
};
