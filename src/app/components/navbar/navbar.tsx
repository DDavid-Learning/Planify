import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import PersonIcon from '@mui/icons-material/Person';
import theme from '../../../core/theme/theme';
import { LoginLogo } from './style';
import { CircularProgress, InputAdornment } from '@mui/material';
import DefaultModal from '../defaultModal/defaultModal';
import GenericTextField from '../genericTextField/genericTextField';
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from '@mui/icons-material/Email';
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from '../../../core/context/auth/useAuth';
import { useEffect, useState } from 'react';
import { userService } from '../../../core/services/api/userService';
import { useFormik } from 'formik';
import * as Yup from "yup";
import DefaultDialog from '../defaultDialog/defaultDialog';
import { Notification } from '../toastNotification/toastNotification';
import { useLocation, useNavigate } from 'react-router-dom';

const pages = ['Dashboard', 'Transações', 'Metas', 'Categorias', "Relatório"];
const settings = ['Perfil', 'Sair'];

function Navbar() {
  const { logout, userId, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [openProfileModal, setOpenProfileModal] = React.useState(false); // Estado para abrir/fechar modal
  const [user, setUser] = useState<any>();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function togglePassword() {
    setShowPassword(!showPassword);
  }

  const handleClickPages = (page: string) => {
    switch (page) {
      case "Dashboard":
        navigate("/home");
        break;
      case "Transações":
        navigate("/transacoes");
        break;
      case "Metas":
        navigate("/metas");
        break;
      case "Categorias":
        navigate("/categorias");
        break;
      case "Relatório":
        navigate("/download-pdf");
        break;
      default:
        break;
    }
  }

  const getPageRoute = (page: string) => {
    switch (page) {
      case "Dashboard":
        return "/home";
      case "Transações":
        return "/transacoes";
      case "Metas":
        return "/metas";
      case "Categorias":
        return "/categorias";
      case "Relatório":
        return "/download-pdf"
      default:
        return "/";
    }
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "O nome de usuário deve ter pelo menos 3 caracteres")
      .required("Campo obrigatório"),
    email: Yup.string()
      .email("Email inválido")
      .required("Campo obrigatório"),
    password: Yup.string(),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "As senhas devem coincidir") // Substituí 'null' por 'undefined'

  });


  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      if (openProfileModal && userId) {
        try {
          const user = await userService.detailsUser(userId);
          setUser(user);
          formik.setFieldValue("username", user.username);
          formik.setFieldValue("email", user.email);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      }
    };

    fetchUserDetails();
  }, [openProfileModal, userId]);

  const handleRmvUser = React.useCallback(async () => {
    console.log(`Deletando esse usuário: ${userId}, com esse token: ${token}`);
    await userService.rmvUser(token!, userId);
    Notification("Conta deletada com sucesso", "success");
    logout();
  }, [userId]);

  const handleEditProfile = React.useCallback(async (user: any) => {
    console.log(`Editando esse usuário: ${userId}, com esse token: ${token}`);
    await userService.editUser(userId!, token!, user?.username, user?.email);
    Notification("Usuário editado com sucesso", "success");
    setOpenProfileModal(false);
  }, [userId]);

  const formik = useFormik({
    initialValues: {
      username: user?.username ? user.username : "",
      email: user?.email ? user.email : "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      console.log(values);
      handleEditProfile(values);
    },
  });

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenProfileModal = () => {
    setOpenProfileModal(true);
    handleCloseUserMenu();
  };

  const handleCloseProfileModal = () => {
    setOpenProfileModal(false);
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <AppBar position="static" sx={{ backgroundColor: theme.COLORS.PURPLE4 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ gap: 2 }}>
            <Box sx={{ borderRadius: "50%", backgroundColor: theme.COLORS.GRAY6, width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LoginLogo />
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {pages.map((page) => {
                const isActive = location.pathname === getPageRoute(page); // Verifica se a rota é ativa
                return (
                  <Button
                    key={page}
                    onClick={() => handleClickPages(page)}
                    sx={{
                      my: 2,
                      color: isActive ? theme.COLORS.PURPLE1 : 'white',
                      backgroundColor: isActive ? theme.COLORS.WHITE : 'transparent',
                      borderRadius: '5px',
                      display: 'block',
                      ':hover': { backgroundColor: theme.COLORS.PURPLE2, color: theme.COLORS.PURPLE1 },
                    }}
                  >
                    {page}
                  </Button>
                );
              })}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Abrir configurações">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ background: theme.COLORS.GRAY5, ':hover': { background: theme.COLORS.GRAY4 } }}
                >
                  <PersonIcon sx={{ color: theme.COLORS.PURPLE4 }} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={setting === 'Perfil' ? handleOpenProfileModal : setting === 'Sair' ? logout : handleCloseUserMenu}
                  >
                    <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <DefaultDialog
        isOpen={confirmation}
        title="Deletar Conta"
        onCloseAction={() => setConfirmation(false)}
        confirmAction={() => handleRmvUser()}
        confirmText="Deletar"
        body={<Typography sx={{ fontSize: "0.8pc" }}>Tem certeza que deseja deletar sua conta?</Typography>}
      />

      {/* Modal do Perfil */}
      <DefaultModal
        title="Perfil"
        isOpen={openProfileModal}
        onClose={handleCloseProfileModal}
        onOpen={handleOpenProfileModal}
      >
        <Box sx={{ padding: "1rem", }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "45svw", height: "30svh" }}>
              <CircularProgress />
            </Box>) : (
            <>
              <Box sx={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                <Box sx={{ backgroundColor: theme.COLORS.PURPLE3, borderRadius: "7px 20px 0 0", width: "max-content", padding: "0.3rem" }}>
                  <Typography sx={{ color: theme.COLORS.WHITE, fontWeight: "bold" }}>Informações do Usuário</Typography>
                </Box>

              </Box>

              <Box sx={{
                display: "flex", flexDirection: "column", gap: "1rem", width: "100%", padding: "1rem",
                borderRadius: "0 10px 10px 10px", border: "3px  solid", borderColor: theme.COLORS.PURPLE3
              }}>
                <GenericTextField<string>
                  label="Usuário"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={!!formik.errors.username}
                  helperText={!!formik.errors.username}
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
                  helperText={!!formik.errors.email}
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
              <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem", width: "100%", justifyContent: "center", alignItems: "center", paddingTop: "1rem" }}>

                <Button variant='contained' sx={{ backgroundColor: theme.COLORS.PURPLE3, color: theme.COLORS.WHITE, width: "100px" }} onClick={() => setOpenProfileModal(false)}>
                  CANCELAR
                </Button>
                <Button type='submit' onClick={() => formik.handleSubmit()} variant='contained' sx={{ backgroundColor: theme.COLORS.PURPLE3, color: theme.COLORS.WHITE, width: "100px" }}>
                  Salvar
                </Button>
                <Button onClick={() => setConfirmation(true)} variant='contained' sx={{ backgroundColor: theme.COLORS.RED, color: theme.COLORS.WHITE }}>
                  Deletar Conta
                </Button>
              </Box>
            </>
          )
          }


        </Box>
      </DefaultModal>
    </Box>
  );
}

export default Navbar;
