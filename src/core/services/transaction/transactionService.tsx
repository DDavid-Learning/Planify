import { TRANSACTION, TRANSACTION_ID } from "../../constants/constants";
import { formatDate } from "../../utils/globalFunctions";
import { Api } from "../api/api";


const registerTransaction = async (transaction: any) => {
    try {
        const response = await Api.post(TRANSACTION, {
            sender: transaction.sender, recipient: transaction.recipient, value: Number(transaction.value),
            isExpense: transaction.isExpense, user: transaction.user, category: transaction.category, date: formatDate(transaction.date)
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const transactionService = {
    registerTransaction,
}
