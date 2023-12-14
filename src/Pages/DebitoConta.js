import React, { useState, useEffect } from "react";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import axios from "axios";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

const DebitoConta = () => {
  const [banco, setBanco] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [dadosDoadores, setDadosDoadores] = useState([]);

  const handleChangeBanco = (event) => {
    setBanco(event.target.value);
  };

  const handleChangeVencimento = (event) => {
    setVencimento(event.target.value);
  };

  const handleDownload = async () => {
    try {
      const scriptBanco = banco + "_gera_rem.php";
      const url =
        "https://amigosdacasa.org.br/rem_generator/backend/" + scriptBanco;

      // Obtém a data atual e formata para o formato 'AAAAMMDD'
      const dataAtual = new Date();
      const dataFormatadaAtual =
        dataAtual.getFullYear().toString() +
        ("0" + (dataAtual.getMonth() + 1)).slice(-2) +
        ("0" + dataAtual.getDate()).slice(-2);

      // Formata a data para o formato 'AAAAMMDD'
      const dataFormatada = vencimento.replace(/-/g, "");

      const formData = new FormData();
      formData.append("nome_banco", banco);
      formData.append("vencimento", dataFormatada);

      const response = await axios.post(url, formData, {
        responseType: "blob", // Indica que a resposta será um Blob
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });
      const blobUrl = window.URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      const nomeArquivo = banco + dataFormatadaAtual + ".REM";
      downloadLink.download = nomeArquivo;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      alert("Erro ao baixar o arquivo.");
    }
  };

  const columns = [
    {
      field: "nome_completo",
      headerName: "Nome",
      width: 250,
    },
    {
      field: "cpf_cnpj",
      headerName: "CPF/CNPJ",
      width: 150,
      align: "left",
    },
    {
      field: "fone",
      headerName: "Fone",
      width: 140,
    },
    {
      field: "email",
      headerName: "E-mail",
      width: 200,
      align: "left",
    },
    {
      field: "banco",
      headerName: "Banco",
      width: 70,
      align: "right",
    },
    {
      field: "agencia",
      headerName: "Agência",
      width: 70,
      align: "right",
    },
    {
      field: "conta",
      headerName: "Conta",
      width: 120,
      align: "right",
    },
    {
      field: "dv",
      headerName: "DV",
      width: 30,
      align: "center",
    },
    {
      field: "valor",
      headerName: "Valor",
      width: 90,
      align: "right",
      renderCell: (params) => {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(params.value);
      },
    },
  ];

  useEffect(() => {
    axios
      .get("https://amigosdacasa.org.br/rem_generator/backend/consulta_doadores.php")
      .then((response) => {
        setDadosDoadores(response.data);
      });
  }, []);

  return (
    <Box width="100%">
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Banco</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={banco}
            label="Banco"
            onChange={handleChangeBanco}
          >
            <MenuItem value=""></MenuItem>
            <MenuItem value="BB">Banco do Brasil</MenuItem>
            <MenuItem value="BANRISUL">Banrisul</MenuItem>
            <MenuItem value="CAIXA">Caixa</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Vencimento"
          variant="outlined"
          type="date"
          InputLabelProps={{ shrink: true }}
          onChange={handleChangeVencimento}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleDownload}
        >
          Gerar arquivo remessa
        </Button>
      </Box>
      <DataGrid
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        rows={dadosDoadores}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default DebitoConta;
