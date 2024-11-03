const API_URL = "http://localhost:8080";

export const DOWNLOAD_PDF = `${API_URL}/v1/report/export-pdf`;
export const DOWNLOAD_CSV = `${API_URL}/v1/report/export-csv`;

export const EDIT_USER = `${API_URL}/v1/users/me`;
export const RMV_USER = `${API_URL}/v1/users/me`;
export const REGISTER_USER = `${API_URL}/v1/auth/register`;
export const LOGIN_USER = `${API_URL}/v1/auth/login`;
export const DETAILS_USER = `${API_URL}/v1/users/me`;

export const CATEGORY = `${API_URL}/v1/categories`;
export const CATEGORY_ID = `${API_URL}/v1/categories/`;

export const TRANSACTION = `${API_URL}/v1/transactions`;
export const TRANSACTION_ID = `${API_URL}/v1/transactions/`;

export const GOALS = `${API_URL}/v1/goals`;
export const GET_GOAL = `${API_URL}/v1/goals/`;
export const MANAGE_GOAL = `${API_URL}/v1/balance/`;
