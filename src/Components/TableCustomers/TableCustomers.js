import React, { useEffect, useState, useContext } from "react";
import { MyContext } from "../../contexts/MyContext";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import axios from "axios";
import {
  Backdrop,
  CircularProgress,
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
  const { rootState, fetchCustomers } = useContext(MyContext);
  const { customers } = rootState;
  const [open, setOpen] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const { handleSubmit, control, setValue } = useForm();
  const [cityName, setCityName] = useState("");

  const handleCloseLoading = () => setOpenLoading(false); 
  const handleOpenLoading = () => setOpenLoading(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const columns = [
    {
      field: "id",
      headerName: "ID do Doador",
      width: 150,
      // editable: true,
    },
    {
      field: "name",
      headerName: "Nome",
      width: 300,
      // editable: true,
    },
    {
      field: "cpfCnpj",
      headerName: "CPF/CNPJ",
      width: 150,
      // editable: true,
    },
    {
      field: "mobilePhone",
      headerName: "Celular",
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
    axios.post(`${process.env.REACT_APP_URL}/asaas.php?param=30`, {code: customer.city})
    .then((response) => {
      console.log(response.data);
      setCityName(response.data.name);
  
      // Mova a atualização dos valores do formulário para dentro do callback then, depois que o estado da cidade foi atualizado.
      for (let key in customer) {
        setValue(key, customer[key]);
      }
      setValue("notificationDisabled", customer.notificationDisabled);
      setValue("city", response.data.name); // set city to the actual city name
    })
    .catch((error) => {
      console.error(error);
    });
    setOpen(true);
  };
  

  const handleSave = handleSubmit((data) => {
    
    axios
      .post(`${process.env.REACT_APP_URL}/asaas.php?param=2`, data)
      .then((response) => {
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
            width: { xs: "90%", sm: 600, md: 700, lg: 800, xl: 900 },
          }}
        >
          <form onSubmit={handleSave}>
            <Box
              sx={{                
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
                name="name"
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
                name="cpfCnpj"
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
                name="mobilePhone"
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
                name="postalCode"
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
                name="address"
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
                  name="addressNumber"
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
                  name="complement"
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
                  name="province"
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
                  name="city"
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
                name="state"
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
                name="notificationDisabled"
                control={control}
                defaultValue={false} // Se não houver um valor a ser preenchido, ele irá considerar como não marcado
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                    }
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
      <Backdrop
        sx={{
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={openLoading}
        onClick={handleCloseLoading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" component="div" sx={{ mt: 1 }}>
          Carregando...
        </Typography>
      </Backdrop>
    </Box>
  );
};

export default TableCustomers;
