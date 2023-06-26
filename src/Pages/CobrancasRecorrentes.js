import React, { useState, useEffect } from "react";
import {
  Backdrop,
  CircularProgress,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import axios from "axios";
import ReplayIcon from "@mui/icons-material/Replay";
import { DataGrid, ptBR } from "@mui/x-data-grid";

const CobrancasRecorrentes = () => {
  const [cobrancasRecorrentes, setCobrancasRecorrentes] = useState([]);
  const [reload, setReload] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleReload = () => {
    setReload(!reload);
  };

  useEffect(() => {
    handleOpen();
    axios
      .get(`${process.env.REACT_APP_URL}/asaas.php?param=11`)
      .then((response) => {
        setCobrancasRecorrentes(response.data.data);
        handleClose();
        console.log(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reload]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 300,
      // editable: true,
    },
    {
      field: "dueDate",
      headerName: "Vencimento",
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <Typography variant="body1" color="text.secondary" component="div">
          {params.row.dueDate.split("-").reverse().join("/")}
        </Typography>
      ),
    },
    {
      field: "customer",
      headerName: "ID do Cliente",
      width: 150,
      // editable: true,
    },
    {
      field: "invoiceUrl",
      headerName: "URL da Cobrança",
      width: 200,
      // editable: true,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <Button href={params.row.invoiceUrl} target="blank">
          Link
        </Button>
      ),
    },
    {
      field: "value",
      headerName: "Valor",
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <Typography variant="body1" color="text.secondary" component="div">
          {params.row.value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Typography>
      ),
    },
    {
      field: "subscription",
      headerName: "ID da Assinatura",
      width: 150,
    },
  ];

  return (
    <>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Typography variant="h5">Cobranças Recorrentes</Typography>
          <IconButton
            aria-label="reload"
            color="primary"
            onClick={() => handleReload()}
          >
            <ReplayIcon />
          </IconButton>
        </Box>
        <DataGrid
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          rows={cobrancasRecorrentes}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          // checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
      <Backdrop
        sx={{
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" component="div" sx={{ mt: 1 }}>
          Carregando...
        </Typography>
      </Backdrop>
    </>
  );
};

export default CobrancasRecorrentes;
