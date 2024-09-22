import { send } from "process";
import * as Yup from "yup";

export const RegisterCategory = Yup.object().shape({
    name: Yup.string()
        .required("Campo obrigatório")
});

export const RegisterTransaction = Yup.object().shape({
    sender: Yup.string()
        .required("Campo obrigatório"),
        recipient: Yup.string()
        .required("Campo obrigatório"),
        value: Yup.number()
        .min(0, "O valor deve ser maior que 0")
        .required("Campo obrigatório"),
        isExpense: Yup.boolean()
        .required("Campo obrigatório"),
        user: Yup.string()
        .required("Campo obrigatório"),
        date: Yup.string().required("Campo obrigatório")
});