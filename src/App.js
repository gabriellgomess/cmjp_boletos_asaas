import React, {useState, useEffect, useContext} from 'react';
import { CssBaseline, Container, Box, Typography, Button, Switch, FormControlLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Routes, Route, Navigate } from 'react-router-dom';

import MyContextProvider, { MyContext } from "./contexts/MyContext";

// Páginas
import Dashboard from './Pages/Dashboard';
import FormCadastro from './Pages/FormCadastro';
import TableBilling from './Pages/TableBilling';
import FormCadastroLote from './Pages/FormCadastroLote';
import CobrancasRecorrentes from './Pages/CobrancasRecorrentes';
import GenerateBilling from './Pages/GenerateBilling';
import BillingManager from './Pages/BillingManager';
import CustomerManager from './Pages/CustomerManager';

// Componentes
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Home from './Components/Home';

function WithAuthentication({ children }) {
  const { rootState } = useContext(MyContext);
  const { isAuth } = rootState;
  return isAuth ? children : <Navigate to="/" replace />;
}

const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#e9434b',
      light: '#ff983f',
      dark: '#ffffa1',
    },
    accent: {
      main: '#F5F5F5',
      light: '#929292',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#e0e0e0',
      success: '#81c784',
      warning: '#ffb74d'
    },
    background: {
      paper: '#1D1F21',
      green: '#74c3bb',
      default: '#2c2e30',
      dark: '#444648',
    },
  },
  overrides: {
    MuiInput: {
      input: {
        color: '#FFFFFF',
        '&[disabled]': {
          color: '#dedede',
        },
      },
    },
  },
});


// #74c3bb verde
// #f2a243 amarelo
// #e9434b vermelho
// #080b0a preto

const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#e9434b',
      light: '#ff983f',
      dark: '#ff983f',
    },
    accent: {
      main: '#1D1F21',
      light: '#7a7a7a',
    },
    text: {
      primary: '#1D1F21',
      secondary: '#1D1F21',
      success: '#388e3c',
      warning: '#f57c00'
    },
    background: {
      paper: '#FFFFFF',
      green: '#74c3bb',
      default: '#F5F5F5',
      dark: '#e0e0e0',
    },
  },
  // overrides: {
  //   MuiInput: {
  //     input: {
  //       color: '#FFFFFF',
  //       '&[disabled]': {
  //         color: '#dedede',
  //       },
  //     },
  //   },
  // },
});

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") === "dark" ? darkTheme : lightTheme);

  useEffect(() => {
    localStorage.setItem("theme", theme === darkTheme ? "dark" : "light");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === darkTheme ? lightTheme : darkTheme);
  };

  return (
    <MyContextProvider>
      <ThemeProvider theme={theme}>    
        <Header />   
        <Box sx={{bgColor: theme.palette.background.paper}}>      
          <CssBaseline />      
          <Container sx={{ bgcolor: theme.palette.background.dark, minHeight: '100vh', paddingBottom: '60px' }} maxWidth="lg" >
            <Box sx={{width: '100%', display: 'flex', justifyContent: 'end'}}>
              <FormControlLabel
                control={<Switch checked={theme === lightTheme} onChange={toggleTheme} />}
                label={theme === lightTheme ? 'Modo Escuro' : 'Modo Claro'}
                labelPlacement="top"
              /> 
            </Box>           
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path={`${process.env.REACT_APP_PATH}`} element={<WithAuthentication><Dashboard /></WithAuthentication>} />
              <Route path={`${process.env.REACT_APP_PATH}/form_cadastro`} element={<WithAuthentication><FormCadastro /></WithAuthentication>} />
              <Route path={`${process.env.REACT_APP_PATH}/gerar_cobranca`} element={<WithAuthentication><GenerateBilling /></WithAuthentication>} />
              <Route path={`${process.env.REACT_APP_PATH}/table`} element={<WithAuthentication><TableBilling /></WithAuthentication>} />
              <Route path={`${process.env.REACT_APP_PATH}/cobrancas_recorrentes`} element={<WithAuthentication><CobrancasRecorrentes /></WithAuthentication>} />
              <Route path={`${process.env.REACT_APP_PATH}/gerenciar_cobrancas`} element={<WithAuthentication><BillingManager /></WithAuthentication>} />
              <Route path={`${process.env.REACT_APP_PATH}/gerenciar_doadores`} element={<WithAuthentication><CustomerManager /></WithAuthentication>} />
            </Routes>        
          </Container>
        </Box>
        <Footer />
      </ThemeProvider>
    </MyContextProvider>
  );
}

export default App;