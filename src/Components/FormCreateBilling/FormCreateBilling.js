import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "../../contexts/MyContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import PropTypes from "prop-types";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Modal,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material";
import {
  formatToCPFOrCNPJ,
  isCPFOrCNPJ,
  formatToPhone,
  isPhone,
} from "brazilian-values";

import HelpIcon from "@mui/icons-material/Help";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AddLinkIcon from "@mui/icons-material/AddLink";

import swal from "sweetalert";

import Subscriptions from "../FormBillings/Subscriptions";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const FormCreateBilling = () => {
  function CustomTabPanel(props) {
    const { children, valueTab, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={valueTab !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {valueTab === index && (
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    valueTab: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const { rootState, fetchCustomers } = useContext(MyContext);
  const { customers } = rootState;
  const [clientes, setClientes] = useState([]);
  const [customerID, setCustomerID] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [name, setName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [dadosCobranca, setDadosCobranca] = useState([]);

  const [valueTab, setValueTab] = useState(0);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setDadosCobranca([]);
    window.location.reload();
  };

  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };

  // Criar doadores para popular o autocomplete
  const doadores = customers?.map((cliente) => {
    return {
      label: cliente.name + " - " + cliente.cpfCnpj,
      value: cliente.id,
    };
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (data) => {
    axios
      .post(`${process.env.REACT_APP_URL}/asaas.php?param=7`, data)
      .then((response) => {
        setDadosCobranca(response.data);
        swal({
          icon: "success",
          title: "Operação realizada com sucesso!",
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
            handleOpen();
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(data);
  };
  return (
    <>
      <Typography sx={{ textAlign: "center" }} variant="h5">
        Gerar Doação
      </Typography>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Card sx={{ width: "100%", margin: "auto", marginTop: "20px" }}>
        <CardContent>
          <Typography variant="h5">Selecione um doador</Typography>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={doadores}
            sx={{ width: "100%" }}
            onChange={(event, value) => {
              setCustomerID(value ? value.value : "");
              setCpfCnpj(value ? value.label.split(" - ")[1] : ""); // Assume que o CPF/CNPJ está após o " - " no label
              setValue("customerID", value ? value.value : "");
              setValue("cpf_cnpj", value ? value.label.split(" - ")[1] : "");
              setName(value ? value.label.split(" - ")[0] : "");
            }}
            renderInput={(params) => <TextField {...params} label="Doadores" />}
          />
        </CardContent>
      </Card>
      {/* Criar uma cobrança, passando customerID, data de vencimento, valor, cpf_cnpj, descrição, enviar pelo correio (true ou false) */}
      {customerID && (
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={valueTab}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label={<AttachMoneyIcon />} {...a11yProps(0)} />
              <Tab label={<CurrencyExchangeIcon />} {...a11yProps(1)} />
              <Tab label={<AddLinkIcon />} {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel valueTab={valueTab} index={0}>
            <Card sx={{ width: "100%", margin: "auto", marginTop: "20px" }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                  <Typography variant="h5">Doação única</Typography>
                  <Tooltip title="A doação única é uma doação que será cobrada apenas uma vez.">
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
                        {...register("customerID")}
                        label="ID do doador"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                    sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
                      {...register("cpf_cnpj")}
                      label="CPF/CNPJ"
                      value={cpfCnpj}
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
                    <TextField sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }} {...register("value")} label="Valor" required />
                    <TextField
                        sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
                        type="date"
                        {...register("dueDate")}
                        label="Data de vencimento"
                        required
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
                      {...register("description")}
                      label="Descrição"
                      required
                    />
                    <FormControlLabel
                    sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
                      control={
                        <Checkbox
                          {...register("postalService")}
                          name="postalService"
                          color="primary"
                        />
                      }
                      label="Enviar pelo correio"
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
                    <FormControl
                    sx={{ width: { xs: "100%", sm: "100%", md: "48%" } }}
                    >
                    
                      <InputLabel id="demo-simple-select-label">
                        Forma de pagamento
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={paymentMethod}
                        {...register("paymentMethod")}
                        onChange={(event) => {
                          setPaymentMethod(event.target.value);
                          setValue("paymentMethod", event.target.value);
                        }}
                        label="Forma de pagamento"
                      >
                        <MenuItem value="BOLETO">Boleto</MenuItem>
                        <MenuItem value="CREDIT_CARD">
                          Cartão de crédito
                        </MenuItem>
                        <MenuItem value="PIX">Pix</MenuItem>
                        <MenuItem value="Cliente define">
                          Cliente define
                        </MenuItem>
                      </Select>
                    </FormControl>
                    </Box>
                    <Button type="submit" variant="contained">
                      Criar doação única
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </CustomTabPanel>
          <CustomTabPanel valueTab={valueTab} index={1}>
            <Subscriptions
              customerID={customerID}
              cpfCnpj={cpfCnpj}
              name={name}
            />
          </CustomTabPanel>
          <CustomTabPanel valueTab={valueTab} index={2}>
            Link de Pagamento - Em breve
          </CustomTabPanel>
        </Box>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Dados da cobrança
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ID: {dadosCobranca.id}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Valor:{" "}
            {dadosCobranca.value?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Vencimento: {dadosCobranca.dueDate?.split("-").reverse().join("/")}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Forma de pagamento:{" "}
            {dadosCobranca.paymentMethod === "BOLETO"
              ? "Boleto"
              : dadosCobranca.paymentMethod === "CREDIT_CARD"
              ? "Cartão de crédito"
              : dadosCobranca.paymentMethod === "PIX"
              ? "Pix"
              : dadosCobranca.paymentMethod === "UNDEFINED"
              ? "Cliente define"
              : ""}
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Link do boleto:{" "}
            <Button href={dadosCobranca.bankSlipUrl} target="_blank">
              Abrir boleto
            </Button>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Link do pagamento:{" "}
            <Button href={dadosCobranca.invoiceUrl} target="_blank">
              Abrir pagamento
            </Button>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default FormCreateBilling;
