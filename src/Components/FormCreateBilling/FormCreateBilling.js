import React, { useState, useEffect, useContext } from "react";

import { useForm } from 'react-hook-form';
import axios from 'axios'
import { TextField, Button, Box, Typography, InputLabel, MenuItem, FormControl, Select, Card, CardContent, FormControlLabel, Checkbox, Divider } from '@mui/material'
import {formatToCPFOrCNPJ, isCPFOrCNPJ, formatToPhone, isPhone } from 'brazilian-values'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormCobranca = () => {
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');
    const [mobile, setMobile] = useState('');
    const [isCpfOrCnpj, setIsCpfOrCnpj] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        cpfValid: false,
        cpf: '',
        email: '',
        phone: '',
        mobile: '',
        valor: '',
        forma_pagamento: '',
        acceptTerms: false,
      });
    

      const handleCpfChange = (event) => {
        const cpfInput = event.target.value;
        setCpf(cpfInput);
        const cpfValid = isCPFOrCNPJ(cpfInput)
        setFormData((prevData) => ({ ...prevData, cpfValid, cpf: cpfInput }));
        if (cpfValid) fetchAsaasData(cpfInput);
    };  
    const formattedCpf = formatToCPFOrCNPJ(cpf);   

    const handlePhoneChange = (event) => {
      const phoneInput = event.target.value;
      setPhone(phoneInput);
      setFormData((prevData) => ({ ...prevData, phone: phoneInput }));
  };

    const formattedPhone = formatToPhone(phone);

    const handleMobileChange = (event) => {
      const mobileInput = event.target.value;
      setMobile(mobileInput);
      setFormData((prevData) => ({ ...prevData, mobile: mobileInput }));
  };

    const handleFormatCurrency = (event) => {
        var valor = event.target.value.replace(/\D/g,"");
        valor = (valor/100).toFixed(2) + "";
        setFormData({...formData, valor: valor})
        valor = valor.replace(".", ",");
        valor = valor.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
        valor = valor.replace(/(\d)(\d{3}),/g, "$1.$2,");
        event.target.value = valor === "0,00" ? "" : "R$ "+valor;
        
    }

    const formattedMobile = formatToPhone(mobile);

    const { register, handleSubmit } = useForm()

    const onSubmit = (data) => {
        data.billingType = formData.forma_pagamento
        data.value = formData.valor
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 2);
        const dueDate = currentDate.toISOString().split('T')[0];
        data.dueDate = dueDate;
        axios.post(`${process.env.REACT_APP_URL_ASAAS}p=1`, data)
        .then((res)=>{
            console.log("Retorno: ", res)
            if(res.data.errors){
                res.data.errors.forEach((error)=>{
                    console.log("Error: ", error.description)
                })
            }else if(res.data.invoiceUrl){
                console.log("URL: ", res.data.invoiceUrl)
                toast.success('Cobrança criada com sucesso!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    onClose: () => {
                 
                    }
                    });
               
                window.open(res.data.invoiceUrl, '_blank');
            }          
       
        })
    }


    const handleFieldChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
      
      const handleValidateForm = () => {
        const { nome, valor, cpfValid, forma_pagamento, acceptTerms } = formData;
        const isValid = nome !== '' && cpfValid === true && valor >= 5.00 && forma_pagamento !== '' && acceptTerms;
        return isValid;
    };

      useEffect(() => {
        handleValidateForm();
        }, [formData]);

        const fetchAsaasData = async (cpfOrCnpj) => {
          // Substitua "https://sua-api.com/search" pelo endereço da sua API
          const cpfCleaner = cpfOrCnpj.replace(/[^\d]+/g, '');
          const response = await axios.post(`${process.env.REACT_APP_URL}/asaas.php?param=27`, { cpf: cpfCleaner })
          const data = response.data.data[0];
      
          console.log("Data: ", data)
      
          if (data) {
              setFormData((prevData) => ({ 
                  ...prevData,
                  nome: data.name,
                  email: data.email,
                  phone: data.phone,
                  mobile: data.mobilePhone,
              }));
          }
      }; 

    return(
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Typography sx={{textAlign: 'center'}} variant='h5'>CRIAR COBRANÇA</Typography>
            <Box sx={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', width: {xs: '100%'}, height: {xs: '100%'}, maxWidth: '900px', marginBottom: '20px'}}>
              <Box sx={{width: {xs: '100%'}, minWidth: '350px'}}>
              <Box sx={{gap:'20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', margin: '30px 0'}}>
                    <TextField sx={{width: {xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '100%'}}} {...register('nome')} onChange={handleFieldChange} name='nome' label='Nome Completo' required value={formData.nome} InputLabelProps={{ shrink: true }} />
                    <TextField sx={{width: {xs: '100%', sm: '100%', md: '47%', lg: '48%', xl: '48%'}}} {...register('cpf')} name='cpf' label='CPF ou CNPJ' value={formattedCpf} required onChange={handleCpfChange} InputLabelProps={{ shrink: true }} />
                    <TextField sx={{width: {xs: '100%', sm: '100%', md: '47%', lg: '48%', xl: '48%'}}} {...register('email')} name='email' label='E-mail' onChange={handleFieldChange} value={formData.email} InputLabelProps={{ shrink: true }} />
                    <TextField sx={{width: {xs: '100%', sm: '100%', md: '47%', lg: '48%', xl: '48%'}}} {...register('phone')} name='phone' label='Telefone'  onChange={handlePhoneChange} value={formData.phone} InputLabelProps={{ shrink: true }} />
                    <TextField sx={{width: {xs: '100%', sm: '100%', md: '47%', lg: '48%', xl: '48%'}}} {...register('mobile')} name='mobile' label='Celular' onChange={handleMobileChange} value={formData.mobile} InputLabelProps={{ shrink: true }}  />
                    <TextField sx={{width: {xs: '100%', sm: '100%', md: '47%', lg: '48%', xl: '48%'}}} {...register('valor')} onChange={handleFieldChange} onKeyUp={(event)=>handleFormatCurrency(event)} name='valor' label='Valor (mínimo R$5,00)' required />                                 

                    <FormControl sx={{width: {xs: '100%', sm: '100%', md: '47%', lg: '48%', xl: '48%'}}} required>
                        <InputLabel id="demo-simple-select-label">Forma de Pagamento</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Forma de Pagamento"
                        {...register('forma_pagamento')}
                        name='forma_pagamento'
                        onChange={handleFieldChange}
                        >
                        <MenuItem value='BOLETO'>Boleto</MenuItem>
                        <MenuItem value='CREDIT_CARD'>Cartão de Crédito</MenuItem>
                        <MenuItem value='PIX'>PIX</MenuItem>
                        </Select>
                    </FormControl>              
                </Box>
            </Box>
           
            </Box>
            <Button disabled={!handleValidateForm()} variant="contained" type='submit'>continuar</Button>

            {/* <Button variant="contained" onClick={handleTeste}>teste</Button> */}
        </form>
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
        </Box>
    )
}


export default FormCobranca