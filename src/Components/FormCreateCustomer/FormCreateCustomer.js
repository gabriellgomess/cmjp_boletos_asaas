import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  TextField,
  Checkbox,
  Button,
  Box,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";

import HelpIcon from "@mui/icons-material/Help";

import {
  formatToCPFOrCNPJ,
  isCPFOrCNPJ,
  formatToPhone,
  isPhone,
  parseToNumber,
} from "brazilian-values";

import swal from "sweetalert";

const FormCreateCustomer = () => {
  const [endereco, setEndereco] = useState("");
  const [formattedCpf, setFormattedCpf] = useState("");

  const [rawPhone, setRawPhone] = useState("");
  const [rawMobilePhone, setRawMobilePhone] = useState("");
  const [rawCpfCnpj, setRawCpfCnpj] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (data) => {
    // Transformar o nome em maiúsculas
    data.name = data.name.toUpperCase();

    const phone = formatToPhone(rawPhone);
    setValue("phone", phone);
    const mobilePhone = formatToPhone(rawMobilePhone);
    setValue("mobilePhone", mobilePhone);
    const cpfCnpj = formatToCPFOrCNPJ(rawCpfCnpj);
    setValue("cpfCnpj", cpfCnpj);

    axios
      .post(`${process.env.REACT_APP_URL}/asaas.php?param=1`, data)
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
          console.log("Recebido: ", response.data);
        } else if (response.data.error) {
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

        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(data);
  };

  const postalCode = watch("postalCode");

  React.useEffect(() => {
    if (postalCode?.length === 8) {
      buscaCep(postalCode);
    }
  }, [postalCode]);

  const buscaCep = (cep) => {
    axios
      .get(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => {
        setEndereco(response.data);
        setValue("address", response.data.logradouro);
        setValue("province", response.data.bairro);
        setValue("city", response.data.localidade);
        setValue("state", response.data.uf);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const validateCPF = (cpf) => {
    const isValid = isCPFOrCNPJ(cpf);
    return isValid || "CPF inválido";
  };

  const validatePhone = (phone) => {
    if (phone === "") {
      return true;
    }
    const isValid = isPhone(phone);
    return isValid || "Telefone inválido";
  };

  return (
    <>
      <Typography sx={{ textAlign: "center" }} variant="h3">
        Cadastro de doador
      </Typography>
      <form
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          marginTop: "20px",
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "100%", md: "48%" },
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <TextField {...register("name")} label="Nome" required />
          <TextField
            {...register("email", { required: true })}
            label="Email"
            required
          />
          <TextField
            {...register("cpfCnpj", { required: true, validate: validateCPF })}
            label="CPF/CNPJ"
            required
            // Atualize o estado e formate ao digitar
            onChange={(e) => {
              const formattedValue = formatToCPFOrCNPJ(e.target.value);
              setRawCpfCnpj(formattedValue);
            }}
            value={rawCpfCnpj}
          />
          <TextField
            {...register("phone", { validate: validatePhone })}
            label="Telefone"
            // Atualize o estado e formate ao digitar
            onChange={(e) => {
              const formattedValue = formatToPhone(e.target.value);
              setRawPhone(formattedValue);
            }}
            value={rawPhone}
          />
          <TextField
            {...register("mobilePhone", { required: true, validate: validatePhone })}
            label="Celular"
            required
            // Atualize o estado e formate ao digitar
            onChange={(e) => {
              const formattedValue = formatToPhone(e.target.value);
              setRawMobilePhone(formattedValue);
            }}
            value={rawMobilePhone}
          />

          {errors.cpfCnpj && <span>{errors.cpfCnpj.message}</span>}
          <TextField {...register("postalCode")} label="CEP" required />
          <TextField
            {...register("address")}
            label="Endereço"
            required
            InputLabelProps={{ shrink: endereco.logradouro ? true : false }}
          />
        </Box>
        <Box
          sx={{
            width: { xs: "100%", sm: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <TextField {...register("addressNumber")} label="Número" required />
          <TextField {...register("complement")} label="Complemento" />
          <TextField
            {...register("province")}
            label="Bairro"
            required
            InputLabelProps={{ shrink: endereco.bairro ? true : false }}
          />
          <TextField
            {...register("city")}
            label="Cidade"
            required
            InputLabelProps={{ shrink: endereco.localidade ? true : false }}
          />
          <TextField
            {...register("state")}
            label="Estado"
            required
            InputLabelProps={{ shrink: endereco.uf ? true : false }}
          />
          <TextField
            {...register("observations")}
            label="Observações"
            multiline
            rows={4}
          />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <label>
              Desativar notificações:{" "}
              <Checkbox {...register("notificationDisabled")} />
            </label>
            <Tooltip title="Notificações enviadas por e-mail e SMS ao custo de R$0,99, se desabilitadas, o boleto deverá ser enviado por e-mail próprio ou correio">
              <HelpIcon sx={{ cursor: "pointer" }} />
            </Tooltip>
          </Box>
        </Box>
        <Button variant="contained" type="submit">
          Cadastrar
        </Button>
      </form>
    </>
  );
};

export default FormCreateCustomer;

// {
//     "additionalEmails": "email@email.com.br",
//     "address": "Gilberto Ferraz",
//     "addressNumber": "340",
//     "complement": "casa 1",
//     "cpfCnpj": "83029052087",
//     "email": "gabriel.gomes@outlook.com",
//     "externalReference": "referência externa",
//     "mobilePhone": "51992049874",
//     "municipalInscription": "123456789",
//     "name": "Gabriel Gomes",
//     "notificationDisabled": true,
//     "observations": "cliente bom pagador",
//     "phone": "51992049874",
//     "postalCode": "93225070",
//     "province": "Lomba da Palmeira",
//     "stateInscription": "987654321"
//   }
