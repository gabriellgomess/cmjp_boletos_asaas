import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@mui/material";
import Chart from "react-apexcharts";
import axios from "axios";
import collect from "collect.js";
import { useTheme } from "@mui/material/styles";

const BarChart = () => {
  const [barChartData, setBarChartData] = useState({ options: {}, series: [] });

  const theme = useTheme();
  const dateFormatter = new Intl.DateTimeFormat("pt-BR");

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `${process.env.REACT_APP_URL}/asaas.php?param=35`
      );

      // agrupar pagamentos recebidos por data usando collect.js
      const paymentsCollection = collect(
        result.data.filter((item) => item.status === "RECEIVED")
      );

      let maxDate = new Date(Math.max.apply(null, result.data.map(e => new Date(e.paymentDate))));
      let minDate = new Date(maxDate);
      minDate.setDate(minDate.getDate() - 5);
      

      const recentPayments = paymentsCollection.where('paymentDate', '>=', minDate.toISOString().split('T')[0]);

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

      // Cria um objeto com a estrutura { 'date': value }, com todos os valores inicializados como 0
      let completeData = {};
      for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
        completeData[dateFormatter.format(d)] = 0;
      }

      // Sobreponha os valores recebidos aos valores iniciais
      for (const [date, value] of Object.entries(paymentsByDate.all())) {
        completeData[date] = value;
      }

      const dates = Object.keys(completeData);
      const counts = Object.values(completeData);

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
    <Chart
      options={barChartData.options}
      series={barChartData.series}
      type="bar"
      height={350}
    />
  );
};

export default BarChart;
