import React, { useContext, useState } from "react";
import { MyContext } from "../contexts/MyContext";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Typography,
  Button
} from "@mui/material";
import Woman from "../assets/img/woman.png"

function Login() {
  const { toggleNav, loginUser, isLoggedIn } = useContext(MyContext);

  const initialState = {
    userInfo: {
      email: "",
      password: "",
    },
    errorMsg: "",
    successMsg: "",
  };

  const [state, setState] = useState(initialState);

  // On change input value (email & password)
  const onChangeValue = (e) => {
    setState({
      ...state,
      userInfo: {
        ...state.userInfo,
        [e.target.name]: e.target.value,
      },
    });
  };

  // On Submit Login From
  const submitForm = async (event) => {
    event.preventDefault();
    const data = await loginUser(state.userInfo);
    if (data.success && data.token) {
      setState({
        ...initialState,
      });
      localStorage.setItem("loginToken", data.token);
      await isLoggedIn();
    } else {
      setState({
        ...state,
        successMsg: "",
        errorMsg: data.message,
      });
    }
  };

  // Show Message on Error or Success
  let successMsg = "";
  let errorMsg = "";
  if (state.errorMsg) {
    errorMsg = <div className="error-msg">{state.errorMsg}</div>;
  }
  if (state.successMsg) {
    successMsg = <div className="success-msg">{state.successMsg}</div>;
  }

  return (
    <Card sx={{ width: "600px", margin: "0 auto", display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
      <img height={210} src={Woman} alt="mulher" />
      <CardContent
        sx={{ display: "flex", flexDirection: "column", gap: "20px", width: '50%' }}
      >        
        <Typography variant="h4">Área Restrita</Typography>
        <form onSubmit={submitForm} noValidate>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <TextField
              variant="standard"
              label="E-mail"
              name="email"
              type="email"
              value={state.userInfo.email}
              onChange={onChangeValue}
            />
            <TextField
              variant="standard"
              label="Senha"
              name="password"
              type="password"
              value={state.userInfo.password}
              onChange={onChangeValue}
            />

            {errorMsg}
            {successMsg}

            <Button type="submit" variant="contained">
              Entrar
            </Button>
          </Box>
        </form>
        <Button onClick={toggleNav} variant="outlined">
          Cadastrar
        </Button>
      </CardContent>
    </Card>
  );
}

export default Login;
