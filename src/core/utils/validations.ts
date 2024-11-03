import * as Yup from "yup";

export const RegisterCategory = Yup.object().shape({
  name: Yup.string().required("Campo obrigatório"),
});

export const RegisterTransaction = Yup.object().shape({
  sender: Yup.string().required("Campo obrigatório"),
  recipient: Yup.string().required("Campo obrigatório"),
  value: Yup.number()
    .min(0.01, "O valor deve ser maior que 0")
    .required("Campo obrigatório"),
  isExpense: Yup.string()
    .oneOf(["true", "false"], "Campo obrigatório")
    .required("Campo obrigatório"),
  date: Yup.string().required("Campo obrigatório"),
  status: Yup.string()
    .oneOf(["PENDING", "COMPLETE"], "Status deve ser PENDING ou COMPLETE")
    .required("Campo obrigatório"),
});
