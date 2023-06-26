import React, { useEffect } from "react";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import axios from "axios";
import {
  Button,
  IconButton,
  Box,
  Typography,
  Modal,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useForm, Controller } from "react-hook-form";
import swal from "sweetalert";

const TableCustomers = () => {
  const [customers, setCustomers] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const { handleSubmit, control, setValue } = useForm();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL}/buscar_clientes.php`)
      .then((response) => {
        setCustomers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const columns = [
    {
      field: "nome",
      headerName: "Nome",
      width: 300,
      // editable: true,
    },
    {
      field: "cpf_cnpj",
      headerName: "CPF/CNPJ",
      width: 150,
      // editable: true,
    },
    {
      field: "celular",
      headerName: "Telefone",
      width: 150,
      // editable: true,
    },
    {
      field: "email",
      headerName: "E-mail",
      width: 200,
      // editable: true,
    },
    {
      field: "customerID",
      headerName: "ID do Doador",
      width: 150,
      // editable: true,
    },
    {
      field: "actions",
      headerName: "Editar",
      sortable: false,
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <IconButton color="success" aria-label="delete" size="large">
          <EditIcon onClick={() => handleClickRow(params.row)} />
        </IconButton>
      ),
    },
  ];

  const handleClickRow = (customer) => {
    setOpen(true);
    for (let key in customer) {
      setValue(key, customer[key]);
    }
  };

  const handleSave = handleSubmit((data) => {
    console.log(data);
    axios
      .post(`${process.env.REACT_APP_URL}/asaas.php?param=2`, data)
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          swal({
            icon: "success",
            title: response.data.success,
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
              window.location.reload();
            }
          });
        } else {
          swal({
            icon: "error",
            title: response.data.error,
            buttons: {
              confirm: {
                text: "OK",
                value: true,
                visible: true,
                className: "",
                closeModal: true,
              },
            },
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

  return (
    <Box
      sx={{
        height: { xs: 475, sm: 500, md: 525, lg: 525, xl: 670 },
        width: "100%",
      }}
    >
      <DataGrid
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        rows={customers}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        // checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <form onSubmit={handleSave}>
            <Box
              sx={{
                width: { xs: "90%", sm: 600, md: 700, lg: 800, xl: 900 },
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
                gap: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Editar dados do doador
              </Typography>
              <Controller
                name="nome"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    id="outlined-basic"
                    label="Nome"
                    variant="outlined"
                  />
                )}
              />
              <Controller
                name="cpf_cnpj"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    id="outlined-basic"
                    label="CPF/CNPJ"
                    variant="outlined"
                  />
                )}
              />
              <Controller
                name="celular"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    id="outlined-basic"
                    label="Celular"
                    variant="outlined"
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    id="outlined-basic"
                    label="E-mail"
                    variant="outlined"
                  />
                )}
              />
              <Controller
                name="cep"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    id="outlined-basic"
                    label="CEP"
                    variant="outlined"
                  />
                )}
              />
              <Controller
                name="endereco"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    id="outlined-basic"
                    label="Endereço"
                    variant="outlined"
                  />
                )}
              />
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Controller
                  name="numero_endereco"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      id="outlined-basic"
                      label="Número"
                      variant="outlined"
                    />
                  )}
                />

                <Controller
                  name="complemento"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      id="outlined-basic"
                      label="Complemento"
                      variant="outlined"
                    />
                  )}
                />
              </Box>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Controller
                  name="bairro"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      id="outlined-basic"
                      label="Bairro"
                      variant="outlined"
                    />
                  )}
                />

                <Controller
                  name="cidade"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      fullWidth
                      id="outlined-basic"
                      label="Cidade"
                      variant="outlined"
                    />
                  )}
                />
              </Box>
              <Controller
                name="estado"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    id="outlined-basic"
                    label="Estado"
                    variant="outlined"
                  />
                )}
              />
              <Controller
                name="notificacao"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControlLabel
                    {...field}
                    control={<Checkbox />}
                    label="Desativar notificações"
                  />
                )}
              />

              <Button variant="contained" type="submit">
                Salvar
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default TableCustomers;
