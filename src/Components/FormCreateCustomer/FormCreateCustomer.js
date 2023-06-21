import React, {useState} from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { TextField, Checkbox, Button, Box, Typography, Divider } from '@mui/material';

const FormCreateCustomer = () => {
  const [endereco, setEndereco] = useState("");
  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm();

  const onSubmit = (data) => {
    axios.post(`${process.env.REACT_APP_URL}/asaas.php?param=1`, data)
      .then(response => {
        if(response.data.success){
            alert(response.data.success);
        }else if(response.data.error){
            alert('Erro: '+response.data.error);
        }
        
        console.log(response);
      })
      .catch(error => {
        console.error(error);
      });
    console.log(data);
  };

  const postalCode = watch("postalCode");

  React.useEffect(() => {
    if(postalCode?.length === 8){
      buscaCep(postalCode);
    }
  }, [postalCode])

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

  return (
    <>
    <Typography sx={{textAlign: 'center'}} variant='h3'>Cadastro de doador</Typography>
    <form style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}} onSubmit={handleSubmit(onSubmit)}>        
        <Box sx={{width: '50%', display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <TextField {...register("name")} label="Nome" required />
            <TextField {...register("email", { required: true })} label="Email" required />
            <TextField {...register("phone")} label="Telefone" />
            <TextField {...register("mobilePhone")} label="Celular" required />
            <TextField {...register("cpfCnpj")} label="CPF/CNPJ" required />
            <TextField {...register("postalCode")} label="CEP" required />
            <TextField {...register("address")} label="Endereço" required InputLabelProps={{ shrink: endereco.logradouro ? true : false }}/>
            <TextField {...register("addressNumber")} label="Número" required />
            <TextField {...register("complement")} label="Complemento" required />
            <TextField {...register("province")} label="Bairro" required  InputLabelProps={{ shrink: endereco.bairro ? true : false }}/>
            <TextField {...register("city")} label="Cidade" required  InputLabelProps={{ shrink: endereco.localidade ? true : false }}/>
            <TextField {...register("state")} label="Estado" required  InputLabelProps={{ shrink: endereco.uf ? true : false }}/>
            <label>Desativar notificações: <Checkbox {...register("notificationDisabled")} /></label>
            <TextField {...register("observations")} label="Observações" multiline rows={4} />
            <Button type="submit">Enviar</Button>
      </Box>
    </form>
    </>
  );
}

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
  
