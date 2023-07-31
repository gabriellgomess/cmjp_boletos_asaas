import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@mui/material";
import Chart from "react-apexcharts";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

const fetchValues = async (type) => {
  const response = await axios.post(
    `${process.env.REACT_APP_URL}/asaas.php?param=26`,
    { status: type }
  );
  return { ...response.data, status: type };
};

const PieChart = () => {
  const [pieChartData, setPieChartData] = useState({ options: {}, series: [] });
  const theme = useTheme();

  const statusTranslations = {
    PENDING: "Pendente",
    RECEIVED: "Recebido",
    OVERDUE: "Atrasado",
    "": "Geral",
  };

  useEffect(() => {
    const types = ["RECEIVED", "PENDING", "OVERDUE"];
    Promise.all(types.map(fetchValues))
      .then((data) => {
        const chartValues = data.filter((value) => value.status !== "");

        setPieChartData({
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
                colors: [theme.palette.text.primary],
              },
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: "100%",
                  },
                },
              },
            ],
          },
        });
      })
      .catch(console.error);
  }, [theme.palette.text.primary]);

  return (

        <Chart
          options={pieChartData.options}
          series={pieChartData.series}
          type="pie"
        />
  
  );
};

export default PieChart;
