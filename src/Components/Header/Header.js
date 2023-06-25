import { Link } from "react-router-dom";

import React, { useState } from "react";
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

import Logo from "../../assets/img/logo_grey.png";
import LogoHorizontal from "../../assets/img/logotipo_amc.png";

function Header() {
  const theme = useTheme();

  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1}}>
            
            <img
              width={180}
              src={LogoHorizontal}
              alt="Logo Casa do Menino Jesus de Praga"
            />
            
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
                    Gerar Cobrança
                  </Button>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to={`${process.env.REACT_APP_PATH}/gerenciar_doadores`}>
                  <Button
                    sx={{ color: theme.palette.text.primary }}
                    variant="text"
                  >
                    Gerenciar Doadores
                  </Button>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to={`${process.env.REACT_APP_PATH}/gerenciar_cobrancas`}>
                  <Button
                    sx={{ color: theme.palette.text.primary }}
                    variant="text"
                  >
                    Gerenciar Cobranças
                  </Button>
                </Link>
              </MenuItem>             
              
            </Menu>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>     
               
            <img
              width={160}
              src={LogoHorizontal}
              alt="Logo Casa do Menino Jesus de Praga"
            />
            
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
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
                Gerar Cobrança
              </Button>
            </Link>
            <Link to={`${process.env.REACT_APP_PATH}/gerenciar_doadores`}>
              <Button
                sx={{ color: theme.palette.text.secondary }}
                variant="text"
              >
                Gerenciar Doadores
              </Button>
            </Link>
            <Link to={`${process.env.REACT_APP_PATH}/gerenciar_cobrancas`}>
              <Button
                sx={{ color: theme.palette.text.secondary }}
                variant="text"
              >
                Gerenciar Cobranças
              </Button>
            </Link>            
            
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
