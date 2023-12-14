import { Link } from "react-router-dom";
import { MyContext } from "../../contexts/MyContext";

import React, { useState, useContext } from "react";
import {
  AppBar,
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

const menuItems = [
  { path: "", label: "Dashboard" },
  { path: "/form_cadastro", label: "Cadastrar Doador" },
  { path: "/gerar_cobranca", label: "Gerar Doação" },
  { path: "/links_pagamento", label: "Links de Pagamento" },
  { path: "/debito_conta", label: "Débito em Conta" },
  { path: "/gerenciar_doadores", label: "Gerenciar Doadores" },
  { path: "/doacoes", label: "Doações" },
  { path: "/extrato", label: "Extrato da conta" },
];

function Header() {
  const theme = useTheme();
  const { rootState, logoutUser } = useContext(MyContext);
  const { isAuth } = rootState;

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
          sx={{ background: theme.palette.background.header}}
          position="static"
        >
          <Container maxWidth="xl">
          <Toolbar disableGutters>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 3,
                  mr: 1,
                  width: "100%",
                  height: {xs: '', sm: '', md: 80, lg: 80, xl: 120}
                }}
              >
                <Box sx={{height: {xs:40, sm: 40, md:50, lg: 60}}}>
                  <img
                    height='100%'
                    src={Logo}
                    alt="Logo Casa do Menino Jesus de Praga"
                  />
                </Box>
                <Box sx={{height: {xs:40, sm: 40, md:50, lg: 60}}}>
                   <img
                      height='100%'
                      src={LogoLG}
                      alt="Logo Casa do Menino Jesus de Praga"
                    />
                </Box>
                
               
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
      <AppBar position="static" sx={{ height: {xs: '', sm: '', md: 40, lg: 50, xl: 60} }}>
        <Container maxWidth="xl" sx={{height: '100%', display: 'flex', alignItems: 'center'}}>
          <Toolbar disableGutters sx={{ minHeight: '30px !important', display: 'flex' }}>
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
                    size="small"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
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
                    {menuItems.map((item) => (
                      <MenuItem key={item.label} onClick={handleCloseNavMenu}>
                        <Link to={`${process.env.REACT_APP_PATH}${item.path}`}>
                          <Button
                            sx={{ color: theme.palette.text.primary }}
                            variant="text"
                            size="small"
                          >
                            {item.label}
                          </Button>
                        </Link>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
                <Box
                  sx={{
                    flexGrow: 1,
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    justifyContent: "space-between"
                                        
                  }}
                >
                  <Box>
                    {menuItems.map((item) => (
                      <Link
                        key={item.label}
                        to={`${process.env.REACT_APP_PATH}${item.path}`}
                      >
                        <Button
                          sx={{ color: theme.palette.text.secondary }}
                          variant="text"
                          size="small"
                        >
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </Box>
                </Box>
                <IconButton
                  onClick={logoutUser}
                  aria-label="delete"
                  size="small"
                >
                  <LogoutIcon fontSize="inherit" />
                </IconButton>
              </>
            ) : null}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
export default Header;
