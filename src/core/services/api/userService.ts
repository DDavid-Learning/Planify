import {
  DETAILS_USER,
  EDIT_USER,
  REGISTER_USER,
} from "../../constants/constants";
import { Api } from "./api";

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
};
