import { Box, Button, InputAdornment, Typography } from "@mui/material";
import { LoginContainer, LoginContentBox, LoginLogo } from "./styles";
import GenericTextField from "../../components/genericTextField/genericTextField";
import theme from "../../../core/theme/theme";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from '@mui/icons-material/Email';
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Register = () => {


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
                    REGISTRAR CONTA
                </Typography>


                <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
                    <GenericTextField<string>
                        value="teste"
                        label="Usuário"
                        name="login"
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
                        value="teste"
                        label="Email"
                        name="login"
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
                            value="teste"
                            name="password"
                            type="password"
                            props={{
                                fullWidth: true,
                                InputProps: {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <VisibilityOffIcon />
                                    </InputAdornment>
                                  ),
                                },
                              }}
                        />
                        <GenericTextField<string>
                            label="Confirmar Senha"
                            value="teste"
                            name="password"
                            type="password"
                            props={{
                                fullWidth: true,
                                InputProps: {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <VisibilityOffIcon />
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
                >
                    Login
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
                    <Typography>REGISTRAR</Typography>
                </Button>
                <Typography sx={{ fontSize: "0.8pc" }}>V {"1.0.0"}</Typography>
            </LoginContentBox>
        </LoginContainer>
    );
};

export default Register;
