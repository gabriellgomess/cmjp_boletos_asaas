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
                    justifyContent: "space-between",
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
                  size="large"
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
