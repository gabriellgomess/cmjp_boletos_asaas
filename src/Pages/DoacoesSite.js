import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
} from "@mui/material";

const DoacoesSite = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapeamento de identificadores para nomes amigáveis
  const externalReferences = {
    DUADC: "Doações Únicas Amigos da Casa",
    DRADC: "Doações Recorrentes Amigos da Casa",
    acolhidos_escola: "Acolhidos na Escola",
    manutencao_entidade: "Manutenção da Entidade",
    reforma_sala: "Reforma da Sala",
  };

  // Tradução dos status para português
  const statusTranslations = {
    PENDING: "Pendente",
    RECEIVED: "Recebido",
    CONFIRMED: "Confirmado",
    OVERDUE: "Vencido",
    REFUNDED: "Reembolsado",
    RECEIVED_IN_CASH: "Recebido em Dinheiro",
    REFUND_REQUESTED: "Reembolso Solicitado",
    REFUND_IN_PROGRESS: "Reembolso em Progresso",
    CHARGEBACK_REQUESTED: "Chargeback Solicitado",
    CHARGEBACK_DISPUTE: "Disputa de Chargeback",
    AWAITING_CHARGEBACK_REVERSAL: "Aguardando Reversão de Chargeback",
    DUNNING_REQUESTED: "Cobrança Solicitada",
    DUNNING_RECEIVED: "Cobrança Recebida",
    AWAITING_RISK_ANALYSIS: "Aguardando Análise de Risco",
  };

  // Cores para cada status
  const statusColors = {
    PENDING: "#FFA500",
    RECEIVED: "#4CAF50",
    CONFIRMED: "#008000",
    OVERDUE: "#f44336",
    REFUNDED: "#0000FF",
    RECEIVED_IN_CASH: "#FFD700",
    REFUND_REQUESTED: "#FF4500",
    REFUND_IN_PROGRESS: "#1E90FF",
    CHARGEBACK_REQUESTED: "#800080",
    CHARGEBACK_DISPUTE: "#8B0000",
    AWAITING_CHARGEBACK_REVERSAL: "#FF69B4",
    DUNNING_REQUESTED: "#A52A2A",
    DUNNING_RECEIVED: "#B22222",
    AWAITING_RISK_ANALYSIS: "#FFA07A",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = Object.keys(externalReferences).map((ref) =>
          axios.post(`${process.env.REACT_APP_URL}/listar-doacoes.php`, {
            externalReference: ref,
          })
        );
        const responses = await Promise.all(requests);
        const payments = responses.flatMap((response) => response.data.data); // Extrai os pagamentos do campo 'data'
        setData(payments);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Função para agrupar por projeto (externalReference) e dentro de cada projeto, agrupar por status
  const groupByProjectAndStatus = (payments) => {
    return payments.reduce((acc, payment) => {
      const project = payment.externalReference;
      const status = payment.status;

      if (!acc[project]) {
        acc[project] = {};
      }
      if (!acc[project][status]) {
        acc[project][status] = { totalValue: 0, count: 0, payments: [] };
      }

      acc[project][status].totalValue += payment.value;
      acc[project][status].count += 1;
      acc[project][status].payments.push(payment);

      return acc;
    }, {});
  };

  if (loading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Erro ao carregar dados!</Typography>;

  const groupedData = groupByProjectAndStatus(data);

  return (
    <Box>
      <Typography sx={{ marginBottom: "30px" }} variant="h4">
        Doações Recebidas através do site amigosdacasa.org.br
      </Typography>

      {Object.keys(groupedData).length > 0 ? (
        Object.keys(groupedData).map((projectKey, index) => (
          <Box key={index} mb={4}>
            <Typography variant="h5" gutterBottom>
              {externalReferences[projectKey]} {/* Nome amigável do projeto */}
            </Typography>
            <Box sx={{display: 'flex', gap: '20px'}}>
              {Object.keys(groupedData[projectKey]).map((status, idx) => (
                <Card
                  key={idx}
                  variant="outlined"
                  sx={{ mb: 2, backgroundColor: statusColors[status], minWidth: 300 }}
                >
                  <CardContent>
                    <Typography variant="h6">
                      Status: {statusTranslations[status]}
                    </Typography>
                    <Typography variant="body1">
                      Total de Doações: {groupedData[projectKey][status].count}
                    </Typography>
                    <Typography variant="body1">
                      Soma dos Valores: R${" "}
                      {groupedData[projectKey][status].totalValue.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        ))
      ) : (
        <Typography>Nenhuma doação encontrada.</Typography>
      )}
    </Box>
  );
};

export default DoacoesSite;
