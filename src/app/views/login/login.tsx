
import { LoginContainer, LoginContentBox, LoginLogo } from "./style";
import { Box, Button, CircularProgress, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import theme from "../../../core/theme/theme";
import GenericTextField from "../../components/genericTextField/genericTextField";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from '@mui/icons-material/Email';
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useCallback, useState } from "react";
import { useAuth } from "../../../core/context/auth/useAuth";
import { AxiosError } from "axios";


const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  function togglePassword() {
    setShowPassword(!showPassword);
  }
  const auth = useAuth()

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email inválido")
      .required("Campo obrigatório"),
    password: Yup.string()
      .required("Campo obrigatório")
  });

  async function handleLoginSubmit(values: any) {
    setIsLoading(true);
    try {
      const resp = await auth.authenticate(values.email, values.password);
      setIsLoading(false);
      navigate("/home");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data.message);
        setIsLoading(false);
      } else {
        console.error("Ocorreu um erro inesperado");
        setIsLoading(false);
      }
    }

  }


  const handleLogin = useCallback(
    (values: any) => {
      handleLoginSubmit(values)

    },
    []
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    validateOnChange: false, // Validação será feita apenas no submit
    onSubmit: (values) => {
      handleLogin(values)
    },
  });


  return (
    <LoginContainer
      sx={{ display: "flex" }}
    >
      <LoginLogo></LoginLogo>

      <LoginContentBox onSubmit={formik.handleSubmit}>
        <Typography
          sx={{
            fontSize: "1.1pc",
            fontWeight: "bold",
          }}
        >
          ACESSAR CONTA
        </Typography>


        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
          <GenericTextField<string>
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={!!formik.errors.email}
            helperText={formik.errors.email}
            props={{
              fullWidth: true,
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <EmailIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <GenericTextField<string>
            label="Senha"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={!!formik.errors.password}
            helperText={formik.errors.password}
            props={{
              fullWidth: true,
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePassword}>
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

        </Box>
        <Typography
          sx={{
            fontSize: "0.8pc",
            textAlign: "right",
            width: "100%",
            marginTop: -3,
            textDecoration: "underline",
            cursor: "pointer",
            color: theme.COLORS.PURPLE3
          }}
          onClick={() => navigate("/registro")}
        >
          Registrar-se
        </Typography>
        <Button
          type={"submit"}
          sx={{
            fontWeight: "bold",
            borderRadius: 1,
            position: "relative",
            height: "45px",
            backgroundColor: theme.COLORS.PURPLE1,
          }}
          fullWidth
          variant="contained"
        >
          <Typography>ACESSAR</Typography>
        </Button>
        <Typography sx={{ fontSize: "0.8pc", marginTop: 6 }}>V {"1.0.0"}</Typography>
      </LoginContentBox>
    </LoginContainer>
  );
};

export default Login;
