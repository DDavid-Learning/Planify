import { Box, Button, IconButton, InputAdornment, Typography } from "@mui/material";
import { LoginContainer, LoginContentBox, LoginLogo } from "./styles";
import GenericTextField from "../../components/genericTextField/genericTextField";
import theme from "../../../core/theme/theme";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from '@mui/icons-material/Email';
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useCallback, useState } from "react";
import { userService } from "../../../core/services/api/userService";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading ,setIsLoading] = useState(false);
  function togglePassword() {
    setShowPassword(!showPassword);
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "O nome de usuário deve ter pelo menos 3 caracteres")
      .required("Campo obrigatório"),
    email: Yup.string()
      .email("Email inválido")
      .required("Campo obrigatório"),
    password: Yup.string()
      .required("Campo obrigatório"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "As senhas devem coincidir") // Substituí 'null' por 'undefined'
      .required("Campo obrigatório"),
  });

  const handleRegister = useCallback(
    async (values: any) => {
      setIsLoading(true);
      await userService.registerUser(values.username, values.email, values.password)
        .then(() => {
          setIsLoading(false);
          navigate("/login");
        })
        .catch(() => setIsLoading(false));
    },
    []
  );


  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    validateOnChange: false, // Validação será feita apenas no submit
    onSubmit: (values) => {
      handleRegister(values)
    },
  });


  return (
    <LoginContainer
      sx={{ display: "flex" }}
    >
      <LoginLogo></LoginLogo>

      <LoginContentBox onSubmit={formik.handleSubmit} >
        <Typography
          sx={{
            fontSize: "1.1pc",
            fontWeight: "bold",
          }}
        >
          REGISTRAR CONTA
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
          <GenericTextField<string>
            label="Usuário"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={!!formik.errors.username}
            helperText={formik.errors.username}
            props={{
              fullWidth: true,
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <PersonOutlineIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
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
          <Box sx={{ display: "flex", flexDirection: "row", gap: "5px", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
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

            <GenericTextField<string>
              label="Confirmar Senha"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={!!formik.errors.confirmPassword}
              helperText={formik.errors.confirmPassword}
              props={{
                fullWidth: true,
                InputProps: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePassword} >
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

          </Box>

        </Box>
        <Typography
          sx={{
            fontSize: "0.8pc",
            textAlign: "right",
            width: "100%",
            marginTop: -3,
            textDecoration: "underline",
            color: theme.COLORS.PURPLE3
            , cursor: "pointer"
          }}
          onClick={() => navigate("/login")}
        >
          Login
        </Typography>
        <Button
          type={"submit"}
          disabled={isLoading}
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
          <Typography>REGISTRAR</Typography>
        </Button>
        <Typography sx={{ fontSize: "0.8pc" }}>V {"1.0.0"}</Typography>
      </LoginContentBox>
    </LoginContainer>
  );
};

export default Register;
