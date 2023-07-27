import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Box, Card, CardContent } from "@mui/material";
import Chart from "react-apexcharts";
import collect from "collect.js";
import { useTheme } from "@mui/material/styles";

import DadosFinanceiros from "../DadosFInanceiros/DadosFinanceiros";

const DadosWebHook = () => {
  const [data, setData] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [receivedPayments, setReceivedPayments] = useState(0);
  const [overduePayments, setOverduePayments] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [totalNetValue, setTotalNetValue] = useState(0);
  const [pieChartData, setPieChartData] = useState({ options: {}, series: [] });
  const [barChartData, setBarChartData] = useState({ options: {}, series: [] });

  const theme = useTheme();

  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const dateFormatter = new Intl.DateTimeFormat("pt-BR");

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `${process.env.REACT_APP_URL}/asaas.php?param=35`
      );
      setData(result.data);

      // calcular estatísticas
      setTotalPayments(result.data.length);
      setPendingPayments(
        result.data.filter((item) => item.status === "PENDING").length
      );
      setReceivedPayments(
        result.data.filter((item) => item.status === "RECEIVED").length
      );
      setTotalValue(
        result.data.reduce((sum, item) => sum + parseFloat(item.value), 0)
      );
      setOverduePayments(
        result.data.filter((item) => item.status === "OVERDUE").length
      );
      setTotalNetValue(
        result.data.reduce((sum, item) => sum + parseFloat(item.netValue), 0)
      );

      // definir dados do gráfico de pizza
      setPieChartData({
        options: {
          labels: [
            "Pagamentos Pendentes",
            "Pagamentos Recebidos",
            "Pagamentos Atrasados",
          ],
          colors: ["#f2a243", "#74c3bb", "#e9434b"],
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        },
        series: [
          result.data.filter((item) => item.status === "PENDING").length,
          result.data.filter((item) => item.status === "RECEIVED").length,
          result.data.filter((item) => item.status === "OVERDUE").length,
        ],
      });

      // agrupar pagamentos recebidos por data usando collect.js
      const paymentsCollection = collect(
        result.data.filter((item) => item.status === "RECEIVED")
      );

      let maxDate = new Date(Math.max.apply(null, result.data.map(e => new Date(e.paymentDate))));

      maxDate.setDate(maxDate.getDate() - 7);

      const recentPayments = paymentsCollection.where('paymentDate', '>=', maxDate.toISOString().split('T')[0]);

      const paymentsByDate = recentPayments
        .groupBy((item) => {
          // Dividindo a data em partes e criando um novo objeto Date sem hora, minuto e segundo
          const dateParts = item.paymentDate.split("-");
          const paymentDate = new Date(
            dateParts[0],
            dateParts[1] - 1,
            dateParts[2]
          );
          return dateFormatter.format(paymentDate);
        })
        .map((item) => item.sum((item) => parseFloat(item.value)));

      const dates = paymentsByDate.keys().all();
      const counts = paymentsByDate.values().all();

      // calcular a média dos valores
      const averageValue =
        counts.reduce((sum, value) => sum + value, 0) / counts.length;

      // definir dados do gráfico de barras
      setBarChartData({
        options: {
          chart: {
            id: "values",
          },
          colors: ["#74c3bb"],
          xaxis: {
            labels: {
              style: {
                colors: theme.palette.text.primary, // Altera a cor da fonte aqui
              },
            },
            categories: dates,
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
            }
          },
          title: {
            text: "Recebidos nos últimos 7 dias",
            align: "center",
            style: {
              color: theme.palette.text.primary, // Altera a cor da fonte aqui
            },
          },
          yaxis: {
            labels: {
              style: {
                colors: theme.palette.text.primary,
              },
              formatter: function (value) {
                return new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(value);
              },
            },            
          },
          dataLabels: {
            enabled: true,
            offsetY: 10,
            style: {
              fontSize: "12px",
              colors: [theme.palette.text.primary],
            },
            formatter: function (value, { seriesIndex, dataPointIndex, w }) {
              return new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(value);
            },
          },
          annotations: {
            yaxis: [
              {
                y: averageValue,
                borderColor: "#f2a243",
                label: {
                  borderColor: "#f2a243",
                  style: {
                    color: theme.palette.text.primary,
                    background: "#f2a243",
                  },
                  text:
                    "Média " +
                    new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(averageValue),
                },
              },
            ],
          },
        },
        series: [
          {
            name: "valor",
            data: counts,
          },
        ],
      });
    };

    fetchData();
  }, [theme.palette.text.primary]);

  return (
    <Box sx={{ width: "100%"}}>
      <Typography variant="h5">Estatísticas do Pagamento</Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap"
        }}
      >
        <DadosFinanceiros />
        <Card
          sx={{
            width: { xs: "100%", sm: "100%", md: "48%" },
            minWidth: "200px",
          }}
        >
          <CardContent>
            <Chart
              options={barChartData.options}
              series={barChartData.series}
              type="bar"
              height={350}
            />
          </CardContent>
        </Card>
      </Box>
     
    </Box>
  );
};

export default DadosWebHook;
