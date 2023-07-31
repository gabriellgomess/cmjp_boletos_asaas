import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useTheme } from "@mui/material/styles";
import PieChart from "../Chart/PieChart";
import BarChart from "../Chart/BarChart";

const fetchBalance = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_URL}/asaas.php?param=25`
  );
  return response.data.balance;
};

const fetchValues = async (type) => {
  const response = await axios.post(
    `${process.env.REACT_APP_URL}/asaas.php?param=26`,
    { status: type }
  );
  return { ...response.data, status: type };
};

const DadosFinanceiros = () => {
  const [balance, setBalance] = useState(0);
  const [values, setValues] = useState([]);
  const [displayBalance, setDisplayBalance] = useState(0);
  const theme = useTheme();
  const [balanceVisible, setBalanceVisible] = useState(false);

  const handleVisibilityToggle = () => {
    setBalanceVisible(!balanceVisible);
  };

  const statusColors = {
    PENDING: theme.palette.background.yellow,
    RECEIVED: theme.palette.background.green,
    OVERDUE: theme.palette.background.red,
    "": theme.palette.background.blue,
  };

  const statusTranslations = {
    PENDING: "Pendente",
    RECEIVED: "Recebido",
    OVERDUE: "Atrasado",
    "": "Geral",
  };

  useEffect(() => {
    fetchBalance()
      .then((data) => setBalance(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const types = ["", "RECEIVED", "PENDING", "OVERDUE"];
    Promise.all(types.map(fetchValues))
      .then((data) => setValues(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    let intervalId = null;

    if (balance > displayBalance) {
      intervalId = setInterval(() => {
        setDisplayBalance((prev) => Math.min(prev + 100, balance));
      }, 1);
    } else if (balance < displayBalance) {
      intervalId = setInterval(() => {
        setDisplayBalance((prev) => Math.max(prev - 1, balance));
      }, 1);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [balance]);

  const valueList = values.map((value, index) => (
    <Card
      key={index}
      sx={{
        backgroundColor: statusColors[value.status],
        width: { xs: "100%", sm: "100%", md: "150px", lg: "150px" },
      }}
    >
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          color={theme.palette.text.light}
          component="div"
        >
          {statusTranslations[value.status]}
        </Typography>
        <Typography variant="body2" color={theme.palette.text.primary}>
          {value.quantity}
        </Typography>
        <Typography
          sx={{ fontWeight: "bold" }}
          variant="body1"
          color={theme.palette.text.primary}
        >
          {value.value.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })}
        </Typography>
      </CardContent>
    </Card>
  ));

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          width: { xs: "100%", sm: "100%", md: "100%" },
        }}
      >
        <Card
          sx={{
            width: { xs: "100%", sm: "100%", md: "40%"},
            margin: { xs: "20px auto", sm: "20px 0", md: "20px 0" },
          }}
        >
          <CardContent>
            <MonetizationOnIcon />
            <Typography variant="h3" color="text.green">
              {balanceVisible
                ? displayBalance.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })
                : "***********"}
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Saldo atual
            </Typography>
            <IconButton onClick={handleVisibilityToggle}>
              {balanceVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </CardContent>
        </Card>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            width: { xs: "100%", sm: "100%", md: "60%" },
          }}
        >
          {valueList}
        </Box>
      </Box>
      <Box sx={{ width: "100%", margin: "20px 0", display: 'flex', flexWrap: 'wrap' }}>
        <Box sx={{ width: {xs: '100%', sm: '100%', md: '50%'}, minWidth: '330px' }}>
          <BarChart />
        </Box>
        <Box sx={{ width: {xs: '100%', sm: '100%', md: '50%'}, minWidth: '330px' }}>
          <PieChart />
        </Box>
      </Box>
    </Box>
  );
};

export default DadosFinanceiros;
