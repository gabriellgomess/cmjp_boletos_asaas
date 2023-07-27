import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Card, CardContent, Typography } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useTheme } from "@mui/material/styles";
import Chart from "react-apexcharts";

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
    // Garante que não há mais de um contador funcionando ao mesmo tempo
    let intervalId = null;

    if (balance > displayBalance) {
      // Inicia o contador se o valor do saldo for maior que o saldo exibido
      intervalId = setInterval(() => {
        setDisplayBalance((prev) => Math.min(prev + 100, balance));
      }, 1); // Ajuste o intervalo de acordo com a rapidez com que deseja contar
    } else if (balance < displayBalance) {
      // Reduz o contador se o saldo for menor que o saldo exibido
      intervalId = setInterval(() => {
        setDisplayBalance((prev) => Math.max(prev - 1, balance));
      }, 1); // Ajuste o intervalo de acordo com a rapidez com que deseja contar
    }

    // Limpa o intervalo quando o componente é desmontado ou o saldo muda
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [balance]);

  const valueList = values.map((value, index) => (
    <Card key={index} sx={{ backgroundColor: statusColors[value.status], width: {xs: '48%', sm: '48%', md: '30%', lg: '22%'} }}>
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

  // We create a new array excluding the "" type, for the pie chart.
  const chartValues = values.filter((value) => value.status !== "");

  const pieChartData = {
    series: chartValues.map((value) => value.value),
    options: {
      labels: chartValues.map((value) => statusTranslations[value.status]),
      colors: [
        theme.palette.background.green,
        theme.palette.background.yellow,
        theme.palette.background.red,
      ],
      legend: {
        position: "top",
        labels: {
          colors: [theme.palette.text.primary]
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%',
            },
           
          },
        },
      ],
    },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", width: {xs: '100%', sm: '100%', md: '50%'} }}>
      <Card
        sx={{
          width: "100%",
          margin: { xs: "20px auto", sm: "20px 0", md: "20px 0" },
        }}
      >
        <CardContent>
          <MonetizationOnIcon />
          <Typography variant="h3" color={theme.palette.text.green}>
            {displayBalance.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Saldo atual
          </Typography>
        </CardContent>
      </Card>
      <Box sx={{ display: "flex", flexWrap: 'wrap', justifyContent: 'center', gap: "10px" }}>{valueList}</Box>
      <Box sx={{width: '100%'}}>
        <Chart
          options={pieChartData.options}
          series={pieChartData.series}
          type="pie"
        />
      </Box>
    </Box>
  );
};

export default DadosFinanceiros;
