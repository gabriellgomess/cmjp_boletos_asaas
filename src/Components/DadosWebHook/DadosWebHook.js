import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Box, Card, CardContent } from "@mui/material";
import Chart from "react-apexcharts";
import collect from "collect.js";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [receivedPayments, setReceivedPayments] = useState(0);
  const [overduePayments, setOverduePayments] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [totalNetValue, setTotalNetValue] = useState(0);
  const [pieChartData, setPieChartData] = useState({ options: {}, series: [] });
  const [barChartData, setBarChartData] = useState({ options: {}, series: [] });

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
      
      const paymentsByDate = paymentsCollection
        .groupBy((item) => {
          // Dividindo a data em partes e criando um novo objeto Date sem hora, minuto e segundo
          const dateParts = item.paymentDate.split("-");
          const paymentDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
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
            categories: dates,
          },
          title: {
            text: "Valor Recebido por Dia",
            align: "center",
          },
          yaxis: {
            labels: {
              formatter: function (value) {
                return "R$" + value;
              },
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
                    color: "#fff",
                    background: "#f2a243",
                  },
                  text: "Média R$" + averageValue.toFixed(2),
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
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4">Estatísticas do Pagamento</Typography>
      <Typography variant="caption">Desde: 20/07/2023</Typography>
      <Typography variant="body1">
        Total de Pagamentos: {totalPayments}
      </Typography>
      <Typography variant="body1">
        Pagamentos Recebidos: {receivedPayments}
      </Typography>
      <Typography variant="body1">
        Pagamentos Pendentes: {pendingPayments}
      </Typography>
      <Typography variant="body1">
        Pagamentos Atrasados: {overduePayments}
      </Typography>
      <Typography variant="body1">
        Valor Total: {currencyFormatter.format(totalValue)}
      </Typography>
      <Typography variant="body1">
        Valor Líquido Total: {currencyFormatter.format(totalNetValue)}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <Card
          sx={{
            width: { xs: "100%", sm: "100%", md: "48%" },
            minWidth: "300px",
          }}
        >
          <CardContent>
            <Chart
              options={pieChartData.options}
              series={pieChartData.series}
              type="pie"
            />
          </CardContent>
        </Card>
        <Card
          sx={{
            width: { xs: "100%", sm: "100%", md: "48%" },
            minWidth: "300px",
          }}
        >
          <CardContent>
            <Chart
              options={barChartData.options}
              series={barChartData.series}
              type="bar"
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
