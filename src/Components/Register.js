import React, { useContext, useState } from "react";
import { MyContext } from "../contexts/MyContext";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
} from "@mui/material";

function Register() {
  const { toggleNav, registerUser } = useContext(MyContext);
  const initialState = {
    userInfo: {
      name: "",
      email: "",
      password: "",
    },
    errorMsg: "",
    successMsg: "",
  };
  const [state, setState] = useState(initialState);

  // On Submit the Registration Form
  const submitForm = async (event) => {
    event.preventDefault();
    const data = await registerUser(state.userInfo);
    if (data.success) {
      setState({
        ...initialState,
        successMsg: data.message,
      });
    } else {
      setState({
        ...state,
        successMsg: "",
        errorMsg: data.message,
      });
    }
  };

  // On change the Input Value (name, email, password)
  const onChangeValue = (e) => {
    setState({
      ...state,
      userInfo: {
        ...state.userInfo,
        [e.target.name]: e.target.value,
      },
    });
  };

  // Show Message on Success or Error
  let successMsg = "";
  let errorMsg = "";
  if (state.errorMsg) {
    errorMsg = <div className="error-msg">{state.errorMsg}</div>;
  }
  if (state.successMsg) {
    successMsg = <div className="success-msg">{state.successMsg}</div>;
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Card variant="outlined" sx={{ width: "800px" }}>
        <CardContent>
          <Typography variant="h5" component="h1" align="center">
            Cadastrar Usuário
          </Typography>
          <form onSubmit={submitForm} noValidate>
            <Box mt={2}>
              <TextField
                label="Nome Completo"
                name="name"
                required
                fullWidth
                value={state.userInfo.name}
                onChange={onChangeValue}
                placeholder="Digite seu nome completo"
              />
            </Box>
            <Box mt={2}>
              <TextField
                label="Email"
                name="email"
                required
                fullWidth
                type="email"
                value={state.userInfo.email}
                onChange={onChangeValue}
                placeholder="Digite seu email"
              />
            </Box>
            <Box mt={2}>
              <TextField
                label="Senha"
                name="password"
                required
                fullWidth
                type="password"
                value={state.userInfo.password}
                onChange={onChangeValue}
                placeholder="Digite sua senha"
              />
            </Box>
            {errorMsg}
            {successMsg}
            <Box mt={2}>
              <Button type="submit" variant="contained" fullWidth>
                Cadastrar
              </Button>
            </Box>
          </form>
          <Box mt={2} display="flex" justifyContent="center">
            <Button onClick={toggleNav}>Entrar</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register;
