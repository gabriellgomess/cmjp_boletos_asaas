import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import { useForm } from "react-hook-form";
import axios from "axios";
import swal from "sweetalert";

const Subscriptions = (props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    axios
      .post(`${process.env.REACT_APP_URL}/asaas.php?param=18`, data)
      .then((response) => {
        if (response.data.status === "success") {          
          swal({
            icon: "success",
            title: response.data.message,
            buttons: {
              confirm: {
                text: "OK",
                value: true,
                visible: true,
                className: "",
                closeModal: true,
              },
            },
          }).then(() => {
            reset();
          });
        } else if (response.data.status === "error") {          
          swal({
            icon: "error",
            title: response.data.message,
            buttons: {
              confirm: {
                text: "OK",
                value: true,
                visible: true,
                className: "",
                closeModal: true,
              },
            },
          })
        } else {
            swal({
                icon: "error",
                title: "Erro ao processar a requisição.",
                buttons: {
                  confirm: {
                    text: "OK",
                    value: true,
                    visible: true,
                    className: "",
                    closeModal: true,
                  },
                },
              })
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Card sx={{ width: "100%", marginTop: "20px" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Typography variant="h5">Doação Recorrente</Typography>
          <Tooltip title="A doação recorrente é cobrada todos os meses de forma automática com valor definido.">
            <HelpIcon sx={{ color: "primary.main" }} />
          </Tooltip>
        </Box>
        <form
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box
            sx={{
              width: { xs: "100%", sm: "100%", md: "100%" },
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: "15px",
              }}
            >
              <TextField
                sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
                id="customerID"
                label="ID do doador"
                variant="outlined"
                value={props.customerID}
                {...register("customerID")}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
                id="name"
                label="Nome"
                variant="outlined"
                value={props.name}
                {...register("name")}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: "15px",
              }}
            >
              <TextField
                sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
                id="cpfCnpj"
                label="CPF/CNPJ"
                variant="outlined"
                value={props.cpfCnpj}
                {...register("cpfCnpj")}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
                id="nextDueDate"
                label="Próximo Vencimento"
                variant="outlined"
                type="date"
                {...register("nextDueDate", { required: true })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: "15px",
              }}
            >
              <TextField
                sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
                id="value"
                label="Valor"
                variant="outlined"
                type="text"
                {...register("value", { required: true })}
              />

              <FormControl
                sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
              >
                <InputLabel id="demo-simple-select-label">
                  Ciclo de Cobrança
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  {...register("cycle", { required: true })}
                  label="Ciclo de Cobrança"
                >
                  <MenuItem value="MONTHLY">Mensal</MenuItem>
                  <MenuItem value="WEEKLY">Semanal</MenuItem>
                  <MenuItem value="BIWEEKLY">Quinzenal</MenuItem>
                  <MenuItem value="QUARTERLY">Trimestral</MenuItem>
                  <MenuItem value="SEMIANNUALLY">Semestral</MenuItem>
                  <MenuItem value="YEARLY">Anual</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Button variant="contained" type="submit">
              Criar Doação Recorrente
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default Subscriptions;
