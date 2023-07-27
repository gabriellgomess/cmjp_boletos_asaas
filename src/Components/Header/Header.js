import { Link } from "react-router-dom";
import { MyContext } from "../../contexts/MyContext";

import React, { useState, useContext } from "react";
import {
  AppBar,
  Card,
  CardContent,
  Box,
  Toolbar,
  IconButton,
  Menu,
  Container,
  Button,
  MenuItem,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

import Logo from "../../assets/img/logo_horizontal_cmjp.png";
import LogoHorizontal from "../../assets/img/logotipo_amc.png";
import LogoLG from "../../assets/img/logotipo_amc_lg.png";

function Header() {
  const theme = useTheme();
  const { rootState, logoutUser } = useContext(MyContext);
  const { isAuth, theUser } = rootState;

  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          sx={{ background: theme.palette.background.header }}
          position="static"
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  justifyContent: "space-between",
                  padding: 3,
                  mr: 1,
                  width: "100%",
                }}
              >
                <img
                  height={90}
                  src={Logo}
                  alt="Logo Casa do Menino Jesus de Praga"
                />
                <img
                  width={120}
                  src={LogoLG}
                  alt="Logo Casa do Menino Jesus de Praga"
                />
              </Box>
              <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
                <img
                  width={160}
                  src={LogoHorizontal}
                  alt="Logo Casa do Menino Jesus de Praga"
                />
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isAuth ? (
              <>
                <Box
                  sx={{
                    flexGrow: 1,
                    display: { xs: "flex", md: "none" },
                    justifyContent: "space-between",
                  }}
                >
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <IconButton
                    onClick={logoutUser}
                    aria-label="delete"
                    size="large"
                  >
                    <LogoutIcon fontSize="inherit" />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: "block", md: "none" },
                    }}
                  >
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Link to={`${process.env.REACT_APP_PATH}`}>
                        <Button
                          sx={{ color: theme.palette.text.primary }}
                          variant="text"
                        >
                          Dashboard
                        </Button>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Link to={`${process.env.REACT_APP_PATH}/form_cadastro`}>
                        <Button
                          sx={{ color: theme.palette.text.primary }}
                          variant="text"
                        >
                          Cadastrar Doador
                        </Button>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Link to={`${process.env.REACT_APP_PATH}/gerar_cobranca`}>
                        <Button
                          sx={{ color: theme.palette.text.primary }}
                          variant="text"
                        >
                          Gerar Doação
                        </Button>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Link
                        to={`${process.env.REACT_APP_PATH}/links_pagamento`}
                      >
                        <Button
                          sx={{ color: theme.palette.text.primary }}
                          variant="text"
                        >
                          Links de Pagamento
                        </Button>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Link
                        to={`${process.env.REACT_APP_PATH}/gerenciar_doadores`}
                      >
                        <Button
                          sx={{ color: theme.palette.text.primary }}
                          variant="text"
                        >
                          Gerenciar Doadores
                        </Button>
                      </Link>
                    </MenuItem>
                    {/* <MenuItem onClick={handleCloseNavMenu}>
                <Link to={`${process.env.REACT_APP_PATH}/cobrancas_recorrentes`}>
                  <Button
                    sx={{ color: theme.palette.text.primary }}
                    variant="text"
                  >
                    Recorrentes
                  </Button>
                </Link>
              </MenuItem> */}
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Link to={`${process.env.REACT_APP_PATH}/doacoes`}>
                        <Button
                          sx={{ color: theme.palette.text.primary }}
                          variant="text"
                        >
                          Doações
                        </Button>
                      </Link>
                    </MenuItem>
                  
                    {/* <MenuItem onClick={handleCloseNavMenu}>
                <Link to={`${process.env.REACT_APP_PATH}/gerenciar_links`}>
                  <Button
                    sx={{ color: theme.palette.text.primary }}
                    variant="text"
                  >
                    Links de Pagamento
                  </Button>
                </Link>
              </MenuItem>               */}
                  </Menu>
                </Box>
                <Box
                  sx={{
                    flexGrow: 1,
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Link to={`${process.env.REACT_APP_PATH}`}>
                      <Button
                        sx={{ color: theme.palette.text.secondary }}
                        variant="text"
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Link to={`${process.env.REACT_APP_PATH}/form_cadastro`}>
                      <Button
                        sx={{ color: theme.palette.text.secondary }}
                        variant="text"
                      >
                        Cadastrar Doador
                      </Button>
                    </Link>
                    <Link to={`${process.env.REACT_APP_PATH}/gerar_cobranca`}>
                      <Button
                        sx={{ color: theme.palette.text.secondary }}
                        variant="text"
                      >
                        Gerar Doação
                      </Button>
                    </Link>
                    <Link to={`${process.env.REACT_APP_PATH}/links_pagamento`}>
                      <Button
                        sx={{ color: theme.palette.text.secondary }}
                        variant="text"
                      >
                        Links de Pagamento
                      </Button>
                    </Link>
                    <Link
                      to={`${process.env.REACT_APP_PATH}/gerenciar_doadores`}
                    >
                      <Button
                        sx={{ color: theme.palette.text.secondary }}
                        variant="text"
                      >
                        Gerenciar Doadores
                      </Button>
                    </Link>                    
                    {/* <Link to={`${process.env.REACT_APP_PATH}/cobrancas_recorrentes`}>
              <Button
                sx={{ color: theme.palette.text.secondary }}
                variant="text"
              >
                Recorrentes
              </Button>
            </Link> */}
                    <Link to={`${process.env.REACT_APP_PATH}/doacoes`}>
                      <Button
                        sx={{ color: theme.palette.text.secondary }}
                        variant="text"
                      >
                        Doações
                      </Button>
                    </Link>
                   
                    {/* <Link to={`${process.env.REACT_APP_PATH}/gerenciar_links`}>
              <Button
                sx={{ color: theme.palette.text.secondary }}
                variant="text"
              >
                Links de Pagamento
              </Button>
            </Link> */}
                  </Box>
                  <IconButton
                    onClick={logoutUser}
                    aria-label="delete"
                    size="large"
                  >
                    <LogoutIcon fontSize="inherit" />
                  </IconButton>
                </Box>
              </>
            ) : null}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
export default Header;
