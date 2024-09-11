
import { LoginContainer, LoginContentBox, LoginLogo } from "./style";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import theme from "../../../core/theme/theme";
import GenericTextField from "../../components/genericTextField/genericTextField";


const Login = () => {
 

  return (
    <LoginContainer
      sx={{ display: "flex" }}
    >
      <LoginLogo></LoginLogo>

      <LoginContentBox>
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
            value="teste"
            label="Usuário"
            name="login"
          />
          <GenericTextField<string>
            label="Senha"
            value="teste"
            name="password"
          />

        </Box>
        <Typography
          sx={{
            fontSize: "0.8pc",
            marginRight: -20,
            marginTop: -3,
            textDecoration: "underline",
            color: theme.COLORS.PURPLE3
          }}
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
