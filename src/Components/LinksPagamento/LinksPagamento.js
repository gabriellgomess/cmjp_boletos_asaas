import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import {
  isCPF,
  isCEP,
  formatToCPF,
  formatToCNPJ,
  formatToPhone,
} from "brazilian-values";

const LinksPagamento = () => {
  const [links, setLinks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [newLinkData, setNewLinkData] = useState({
    nome: "",
    cpf_cnpj: "",
    celular: "",
    email: "",
    cep: "",
    endereco: "",
    cidade: "",
    numero: "",
    bairro: "",
    complemento: "",
    cycle: "",
    estado: "",
  });

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setNewLinkData({
      nome: "",
      cpf_cnpj: "",
      celular: "",
      email: "",
      cep: "",
      endereco: "",
      cidade: "",
      numero: "",
      bairro: "",
      complemento: "",
      cycle: "",
      estado: "",
    });
  };

  const handleCreate = () => {
    axios.post(`${process.env.REACT_APP_URL}/asaas.php?param=34`, newLinkData)
    .then((response) => {
        console.log(response.data);
    })  
    .catch((error) => {
        console.error(error);
    })
    handleCloseCreate();

  };

  const columns = [
    {
      field: "nome",
      headerName: "Nome",
      width: 300,
    },
    {
      field: "cpf_cnpj",
      headerName: "CPF/CNPJ",
      width: 150,
      align: "left",
    },
    {
      field: "celular",
      headerName: "Celular",
      width: 110,
    },
    {
      field: "email",
      headerName: "E-mail",
      width: 250,
      align: "left",
    },
    {
      field: "endereco",
      headerName: "Endereço",
      width: 400,
      align: "left",
      renderCell: (params) => (
        <Typography variant="body1" color="text.secondary" component="div">
          {params.row.endereco}, {params.row.numero_endereco},{" "}
          {params.row.bairro}, {params.row.cidade}, {params.row.estado}
        </Typography>
      ),
    },
    {
      field: "cycle",
      headerName: "Ciclo",
      width: 150,
      align: "center",
      renderCell: (params) => (
        <Typography variant="body1" color="text.secondary" component="div">
          {params.row.cycle === "MONTHLY" ? "Mensal" : ""}
        </Typography>
      ),
    },
    {
      field: "customerID",
      headerName: "ID do Doador",
      width: 250,
      align: "left",
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Button
            onClick={() => handleOpen(params.row)}
            color="secondary"
            variant="contained"
          >
            <EditIcon />
          </Button>
          <Button
            onClick={() => handleDelete(params.row.id)}
            color="primary"
            variant="contained"
          >
            <DeleteIcon />
          </Button>
        </Box>
      ),
    },
  ];

  const handleOpen = (data) => {
    setOpen(true);
    setEditData(data);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (id) => {
    // chamar a API para deletar a linha baseado no id
    axios.post(`${process.env.REACT_APP_URL}/asaas.php?param=32&id=${id}`);
    console.log("Deletar linha com id: ", id);
  };

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_URL}/asaas.php?param=31`)
      .then((response) => {
        console.log(response.data);
        setLinks(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const validateCPF = (cpf) => {
    if (!isCPF(cpf)) {
      alert("CPF inválido!");
      return false;
    }
    return true;
  };

  const handleChangeCPForCNPJ = (event) => {
    const value = event.target.value;
    const numericalValue = value.replace(/\D/g, "");

    let formattedValue;
    if (numericalValue.length > 11) {
      formattedValue = formatToCNPJ(value);
    } else {
      formattedValue = formatToCPF(value);
    }

    setNewLinkData({ ...newLinkData, cpf_cnpj: formattedValue });
  };

  const handleChangePhone = (event) => {
    const value = event.target.value;
    const formattedValue = formatToPhone(value);
    setNewLinkData({ ...newLinkData, celular: formattedValue });
  };

  const fetchAddress = async (cep) => {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return response.data;
  };

  const handleChangeCEP = async (cep) => {
    if (isCEP(cep)) {
      try {
        const address = await fetchAddress(cep);
        setNewLinkData({
          ...newLinkData,
          endereco: `${address.logradouro}`,
          bairro: `${address.bairro}`,
          cidade: `${address.localidade}`,
          estado: `${address.uf}`,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "end", margin: "15px 0" }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Adicionar link
        </Button>
      </Box>
      <DataGrid
        rows={links}
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
      <Dialog open={openCreate} onClose={handleCloseCreate}>
        <DialogTitle>Criar novo link</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              width: { sm: "552px" },
            }}
          >
            <TextField
              sx={{ width: { xs: "100%", sm: "69%" } }}
              margin="dense"
              label="Nome"
              value={newLinkData.nome}
              onChange={(e) =>
                setNewLinkData({ ...newLinkData, nome: e.target.value })
              }
            />
            <TextField
              sx={{ width: { xs: "100%", sm: "29%" } }}
              margin="dense"
              label="CPF/CNPJ"
              value={newLinkData.cpf_cnpj}
              onChange={handleChangeCPForCNPJ}
            />
          </Box>
          <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <TextField
              sx={{ width: { xs: "100%", sm: "29%" } }}
              margin="dense"
              label="Celular"
              value={newLinkData.celular}
              onChange={handleChangePhone}
            />
            <TextField
              sx={{ width: { xs: "100%", sm: "69%" } }}
              margin="dense"
              label="E-mail"
              value={newLinkData.email}
              onChange={(e) =>
                setNewLinkData({ ...newLinkData, email: e.target.value })
              }
            />
          </Box>
          <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <TextField
              sx={{ width: { xs: "100%", sm: "50%" } }}
              margin="dense"
              label="CEP"
              onKeyUp={(e) => handleChangeCEP(e.target.value)}
              onChange={(e) =>
                setNewLinkData({ ...newLinkData, cep: e.target.value })
              }
            />
          </Box>

          <TextField
            margin="dense"
            label="Rua/Avenida"
            value={newLinkData.endereco}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={
              newLinkData.endereco != null ? { shrink: true } : {}
            }
          />
          <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <TextField
              sx={{ width: { xs: "100%", sm: "49%" } }}
              margin="dense"
              label="Número"
              value={newLinkData.numero}
              onChange={(e) =>
                setNewLinkData({ ...newLinkData, numero: e.target.value })
              }
            />
            <TextField
              sx={{ width: { xs: "100%", sm: "49%" } }}
              margin="dense"
              label="Complemento"
              value={newLinkData.complemento}
              onChange={(e) =>
                setNewLinkData({ ...newLinkData, complemento: e.target.value })
              }
            />
          </Box>
          <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <TextField
              sx={{ width: { xs: "100%", sm: "49%" } }}
              margin="dense"
              label="Bairro"
              value={newLinkData.bairro}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={
                newLinkData.bairro != null ? { shrink: true } : {}
              }
            />
            <TextField
              sx={{ width: { xs: "100%", sm: "49%" } }}
              margin="dense"
              label="Cidade"
              value={newLinkData.cidade}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={
                newLinkData.cidade != null ? { shrink: true } : {}
              }
            />
          </Box>
          <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <TextField
              sx={{ width: { xs: "100%", sm: "49%" } }}
              margin="dense"
              label="Estado"
              value={newLinkData.estado}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={
                newLinkData.estado != null ? { shrink: true } : {}
              }
            />
            <TextField
              sx={{ width: { xs: "100%", sm: "49%" } }}
              margin="dense"
              label="Ciclo"
              value={newLinkData.cycle}
              onChange={(e) =>
                setNewLinkData({ ...newLinkData, cycle: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate}>Cancelar</Button>
          <Button onClick={handleCreate}>Criar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nome"
            value={editData?.nome}
            fullWidth
          />
          <TextField
            margin="dense"
            label="CPF/CNPJ"
            value={editData?.cpf_cnpj}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Celular"
            value={editData?.celular}
            fullWidth
          />
          <TextField
            margin="dense"
            label="E-mail"
            value={editData?.email}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Endereço"
            value={editData?.endereco}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Ciclo"
            value={editData?.cycle}
            fullWidth
          />
          <TextField
            margin="dense"
            label="ID do Doador"
            value={editData?.customerID}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={() => {
              console.log(editData);
              handleClose();
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LinksPagamento;
