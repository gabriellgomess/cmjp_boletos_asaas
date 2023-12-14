import React, { useState, useEffect } from "react";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
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

import swal from "sweetalert";

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
    numero_endereco: "",
    bairro: "",
    complemento: "",
    estado: "",
  });
  const [reload, setReload] = useState(false);
  const theme = useTheme();

  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero_endereco, setNumeroEndereco] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

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
      numero_endereco: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    });
  };

  const handleCreate = () => {
    axios
      .post(`${process.env.REACT_APP_URL}/asaas.php?param=34`, newLinkData)
      .then((response) => {
        console.log(response.data);
        swal({
          icon: "success",
          title: "Doador inserido com sucesso!",
          buttons: {
            confirm: {
              text: "OK",
              value: true,
              visible: true,
              className: "",
              closeModal: true,
            },
          },
        }).then((value) => {
          if (value) {
            handleCloseCreate();
            setReload(!reload);
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
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
      width: 140,
    },
    {
      field: "email",
      headerName: "E-mail",
      width: 250,
      align: "left",
    },
    // {
    //   field: "endereco",
    //   headerName: "Endereço",
    //   width: 400,
    //   align: "left",
    //   renderCell: (params) => (
    //     <Typography variant="body1" color="text.secondary" component="div">
    //       {params.row.endereco}, {params.row.numero_endereco},{" "}
    //       {params.row.bairro}, {params.row.cidade}, {params.row.estado}
    //     </Typography>
    //   ),
    // },

    // {
    //   field: "customerID",
    //   headerName: "ID do Doador",
    //   width: 150,
    //   align: "left",
    // },
    {
      field: "actions",
      headerName: "Ações",
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: "10px" }}>
          <IconButton onClick={() => handleOpen(params.row)} color="secondary">
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id)}
            color="primary"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleOpen = (data) => {
    console.log(data);
    setOpen(true);
    setEditData(data);
    setId(data.id);
    setNome(data.nome);
    setCpfCnpj(data.cpf_cnpj);
    setCelular(data.celular);
    setEmail(data.email);
    setCep(data.cep);
    setEndereco(data.endereco);
    setNumeroEndereco(data.numero_endereco);
    setComplemento(data.complemento);
    setBairro(data.bairro);
    setCidade(data.cidade);
    setEstado(data.estado);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (id) => {
    // chamar a API para deletar a linha baseado no id
    axios
      .post(`${process.env.REACT_APP_URL}/asaas.php?param=33&id=${id}`)
      .then((response) => {
        console.log(response.data);
        swal({
          icon: "success",
          title: "Doador excluído!",
          buttons: {
            confirm: {
              text: "OK",
              value: true,
              visible: true,
              className: "",
              closeModal: true,
            },
          },
        }).then((value) => {
          if (value) {
            setReload(!reload);
          }
        });
      });
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
  }, [reload]);

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          margin: "15px 0",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h4">Links de Pagamento</Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Adicionar link
        </Button>
      </Box>
      <Card
        sx={{ bgColor: theme.palette.background.paper, marginBottom: "10px" }}
      >
        <CardContent>
          <Typography variant="body1" color="text.secondary" component="div">
            Para os doadores cadastrados nesta tabela, será gerado um link de
            pagamento a cada dia 21 do mês e será enviado para o e-mail
            cadastrado.
          </Typography>
          <Typography variant="body1" color="text.secondary" component="div">
            Com este link o doador escolhe o valor que deseja doar e a forma de
            pagamento.
          </Typography>
        </CardContent>
      </Card>

      <DataGrid
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
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
              sx={{ width: { xs: "100%", sm: "69%" } }}
              margin="dense"
              label="Endereço"
              value={newLinkData.endereco}
              onChange={(e) =>
                setNewLinkData({ ...newLinkData, endereco: e.target.value })
              }
            />
            <TextField
              sx={{ width: { xs: "100%", sm: "29%" } }}
              margin="dense"
              label="Número"
              value={newLinkData.numero_endereco}
              onChange={(e) =>
                setNewLinkData({
                  ...newLinkData,
                  numero_endereco: e.target.value,
                })
              }
            />
            <TextField
              sx={{ width: { xs: "100%", sm: "69%" } }}
              margin="dense"
              label="Complemento"
              value={newLinkData.complemento}
              onChange={(e) =>
                setNewLinkData({ ...newLinkData, complemento: e.target.value })
              }
            />
            <TextField
              sx={{ width: { xs: "100%", sm: "29%" } }}
              margin="dense"
              label="Bairro"
              value={newLinkData.bairro}
              onChange={(e) =>
                setNewLinkData({ ...newLinkData, bairro: e.target.value })
              }
            />
            <TextField
              sx={{ width: { xs: "100%", sm: "69%" } }}
              margin="dense"
              label="Cidade"
              value={newLinkData.cidade}
              onChange={(e) =>
                setNewLinkData({ ...newLinkData, cidade: e.target.value })
              }
            />
          </Box>
          <FormControl fullWidth margin="dense">
            <InputLabel>Estado</InputLabel>
            <Select
              value={newLinkData.estado}
              onChange={(e) =>
                setNewLinkData({ ...newLinkData, estado: e.target.value })
              }
            >
              <MenuItem value="AC">Acre</MenuItem>
              <MenuItem value="AL">Alagoas</MenuItem>
              <MenuItem value="AP">Amapá</MenuItem>
              <MenuItem value="AM">Amazonas</MenuItem>
              <MenuItem value="BA">Bahia</MenuItem>
              <MenuItem value="CE">Ceará</MenuItem>
              <MenuItem value="DF">Distrito Federal</MenuItem>
              <MenuItem value="ES">Espírito Santo</MenuItem>
              <MenuItem value="GO">Goiás</MenuItem>
              <MenuItem value="MA">Maranhão</MenuItem>
              <MenuItem value="MT">Mato Grosso</MenuItem>
              <MenuItem value="MS">Mato Grosso do Sul</MenuItem>
              <MenuItem value="MG">Minas Gerais</MenuItem>
              <MenuItem value="PA">Pará</MenuItem>
              <MenuItem value="PB">Paraíba</MenuItem>
              <MenuItem value="PR">Paraná</MenuItem>
              <MenuItem value="PE">Pernambuco</MenuItem>
              <MenuItem value="PI">Piauí</MenuItem>
              <MenuItem value="RJ">Rio de Janeiro</MenuItem>
              <MenuItem value="RN">Rio Grande do Norte</MenuItem>
              <MenuItem value="RS">Rio Grande do Sul</MenuItem>
              <MenuItem value="RO">Rondônia</MenuItem>
              <MenuItem value="RR">Roraima</MenuItem>
              <MenuItem value="SC">Santa Catarina</MenuItem>
              <MenuItem value="SP">São Paulo</MenuItem>
              <MenuItem value="SE">Sergipe</MenuItem>
              <MenuItem value="TO">Tocantins</MenuItem>
            </Select>
          </FormControl>
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
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="CPF/CNPJ"
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Celular"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Número"
            value={numero_endereco}
            onChange={(e) => setNumeroEndereco(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Complemento"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Estado</InputLabel>
            <Select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <MenuItem value="AC">Acre</MenuItem>
              <MenuItem value="AL">Alagoas</MenuItem>
              <MenuItem value="AP">Amapá</MenuItem>
              <MenuItem value="AM">Amazonas</MenuItem>
              <MenuItem value="BA">Bahia</MenuItem>
              <MenuItem value="CE">Ceará</MenuItem>
              <MenuItem value="DF">Distrito Federal</MenuItem>
              <MenuItem value="ES">Espírito Santo</MenuItem>
              <MenuItem value="GO">Goiás</MenuItem>
              <MenuItem value="MA">Maranhão</MenuItem>
              <MenuItem value="MT">Mato Grosso</MenuItem>
              <MenuItem value="MS">Mato Grosso do Sul</MenuItem>
              <MenuItem value="MG">Minas Gerais</MenuItem>
              <MenuItem value="PA">Pará</MenuItem>
              <MenuItem value="PB">Paraíba</MenuItem>
              <MenuItem value="PR">Paraná</MenuItem>
              <MenuItem value="PE">Pernambuco</MenuItem>
              <MenuItem value="PI">Piauí</MenuItem>
              <MenuItem value="RJ">Rio de Janeiro</MenuItem>
              <MenuItem value="RN">Rio Grande do Norte</MenuItem>
              <MenuItem value="RS">Rio Grande do Sul</MenuItem>
              <MenuItem value="RO">Rondônia</MenuItem>
              <MenuItem value="RR">Roraima</MenuItem>
              <MenuItem value="SC">Santa Catarina</MenuItem>
              <MenuItem value="SP">São Paulo</MenuItem>
              <MenuItem value="SE">Sergipe</MenuItem>
              <MenuItem value="TO">Tocantins</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={() => {
              const updatedData = {
                id,
                nome,
                cpf_cnpj: cpfCnpj,
                celular,
                email,
                cep,
                endereco,
                numero_endereco,
                complemento,
                bairro,
                cidade,
                estado,
              };
              axios
                .post(
                  `${process.env.REACT_APP_URL}/asaas.php?param=32`,
                  updatedData
                )
                .then((response) => {
                  console.log(response.data);
                  swal({
                    icon: "success",
                    title: "Dados do doador editados com sucesso!",
                    buttons: {
                      confirm: {
                        text: "OK",
                        value: true,
                        visible: true,
                        className: "",
                        closeModal: true,
                      },
                    },
                  }).then((value) => {
                    if (value) {
                      setReload(!reload);
                      handleClose();
                    }
                  });
                })
                .catch((error) => {
                  console.error(error);
                });
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
