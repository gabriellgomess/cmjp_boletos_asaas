import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Draggable from "react-draggable";
import Box from "@mui/material/Box";
import axios from "axios";
import Select from "@mui/material/Select";
import { MenuItem, FormControl, InputLabel, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function DraggableDialog(props) {
  const { open, onClose, subscription } = props;

  const [formData, setFormData] = useState({
    object: "",
    id: "",
    dateCreated: "",
    customer: "",
    paymentLink: "",
    billingType: "",
    cycle: "",
    value: "",
    nextDueDate: "",
    description: "",
    status: "",
    discount: {
      value: "",
      dueDateLimitDays: "",
    },
    fine: {
      value: "",
    },
    interest: {
      value: "",
    },
    deleted: false,
  });

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_URL}/asaas.php?param=19`, {
        id: subscription,
      })
      .then((response) => {
        setFormData(response.data.data); // Populate form data with API response
        console.log(formData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [open]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(formData);
  };

  const handleSubmit = () => {
    // Send edited data to the backend using axios.post
    axios
      .post(`${process.env.REACT_APP_URL}/asaas.php?param=22`, formData)
      .then((response) => {
        console.log(response.data);
        
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = () => {
    // Send edited data to the backend using axios.post
    alert("ID: ", formData.id);
    axios
      .post(`${process.env.REACT_APP_URL}/asaas.php?param=23`, {id: formData.id})
      .then((response) => {
        console.log(response.data);
        onClose(); // Close the dialog after successful update
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingRight: "10px"
          }}
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            Editar Cobrança Recorrente
          </DialogTitle>
          <IconButton color="primary" aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
                marginTop: "10px",
              }}
            >
              <TextField
                sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
                label="ID da cobrança"
                name="id"
                id="id"
                value={formData.id}
                onChange={handleInputChange}
                disabled
              />
              <TextField
                sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
                label="Data de criação"
                name="dateCreated"
                id="dateCreated"
                type="date"
                value={formData.dateCreated}
                onChange={handleInputChange}
                disabled
              />
              <TextField
                sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
                label="Cliente"
                name="customer"
                id="customer"
                value={formData.customer}
                onChange={handleInputChange}
                disabled
              />

              <FormControl
                sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
              >
                <InputLabel id="demo-simple-select-label">
                  Forma de Pagamento
                </InputLabel>

                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Forma de Pagamento"
                  name="billingType"
                  value={formData.billingType}
                  onChange={handleInputChange}
                >
                  <MenuItem value="BOLETO">Boleto</MenuItem>
                  <MenuItem value="CREDIT_CARD">Cartão de Crédito</MenuItem>
                  <MenuItem value="PIX">Pix</MenuItem>
                  <MenuItem value="UNDEFINED">Usuário define</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
              >
                <InputLabel id="demo-simple-select-label">
                  Ciclo de Cobrança
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  name="cycle"
                  id="cycle"
                  value={formData.cycle}
                  label="Ciclo de Cobrança"
                  onChange={handleInputChange}
                >
                  <MenuItem value="MONTHLY">Mensal</MenuItem>
                  <MenuItem value="WEEKLY">Semanal</MenuItem>
                  <MenuItem value="BIWEEKLY">Quinzenal</MenuItem>
                  <MenuItem value="QUARTERLY">Trimestral</MenuItem>
                  <MenuItem value="SEMIANNUALLY">Semestral</MenuItem>
                  <MenuItem value="YEARLY">Anual</MenuItem>
                </Select>
              </FormControl>
              <TextField
                sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
                label="Valor"
                name="value"
                id="value"
                value={formData.value}
                onChange={handleInputChange}
              />
              <TextField
                sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
                label="Próximo vencimento"
                name="nextDueDate"
                id="nextDueDate"
                type="date"
                value={formData.nextDueDate}
                onChange={handleInputChange}
              />
              <TextField
                sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
                label="Descrição"
                name="description"
                id="description"
                value={formData.description}
                onChange={handleInputChange}
              />
              <TextField
                sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
                label="Status"
                name="status"
                id="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleSubmit}>
            Salvar
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
