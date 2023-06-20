import React, { useState, useEffect, useContext } from "react";

import { useForm } from 'react-hook-form';
import axios from 'axios'
import { TextField, Button, Box, Typography, InputLabel, MenuItem, FormControl, Select, Card, CardContent, FormControlLabel, Checkbox, Divider, Autocomplete } from '@mui/material'
import {formatToCPFOrCNPJ, isCPFOrCNPJ, formatToPhone, isPhone } from 'brazilian-values'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormCreateBilling = () => {
    const [clientes, setClientes] = useState([]);
    const [customerID, setCustomerID] = useState('');
    const [cpfCnpj, setCpfCnpj] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');



    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URL}/buscar_clientes.php`)
            .then(response => {
                setClientes(response.data);
                console.log(response.data)
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    // Criar doadores para popular o autocomplete
    const doadores = clientes.map((cliente) => {
        return {
            label: cliente.nome + " - " + cliente.cpf_cnpj,
            value: cliente.customerID
        }
    })

    const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm();

    const onSubmit = (data) => {
        axios.post(`${process.env.REACT_APP_URL}/asaas.php?param=7`, data)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error(error);
            });    
    };


   return (
        <>
            <Typography sx={{textAlign: 'center'}} variant='h3'>Cobrança</Typography>
            <Card sx={{width: '100%', margin: 'auto', marginTop: '20px'}}>
                <CardContent>
                    <Typography variant='h5'>Selecione um doador</Typography>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={doadores}
                        sx={{ width: '100%' }}
                        onChange={(event, value) => {
                            setCustomerID(value ? value.value : '');
                            setCpfCnpj(value ? value.label.split(" - ")[1] : ''); // Assume que o CPF/CNPJ está após o " - " no label
                            setValue('customerID', value ? value.value : ''); 
                            setValue('cpf_cnpj', value ? value.label.split(" - ")[1] : '');
                        }}
                        renderInput={(params) => <TextField {...params} label="Doadores" />}
                    />                    
                </CardContent>
            </Card>
            {/* Criar uma cobrança, passando customerID, data de vencimento, valor, cpf_cnpj, descrição, enviar pelo correio (true ou false) */}
            {customerID &&
                <Card sx={{width: '100%', margin: 'auto', marginTop: '20px'}}>
                    <CardContent>
                        <Typography variant='h5'>Criar cobrança</Typography>
                        <form style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}} onSubmit={handleSubmit(onSubmit)}>
                            <Box sx={{width: '50%', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                                <TextField {...register("customerID")} label="ID do cliente" disabled />
                                <TextField type="date" {...register("dueDate")} label="Data de vencimento" required InputLabelProps={{ shrink: true }}/>
                                <TextField {...register("value")} label="Valor" required />
                                <TextField {...register("cpf_cnpj")} label="CPF/CNPJ" value={cpfCnpj} disabled />
                                <TextField {...register("description")} label="Descrição" required />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            {...register("postalService")}
                                            name="postalService"
                                            color="primary"
                                        />
                                    }
                                    label="Enviar pelo correio"
                                />
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Forma de pagamento</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select" 
                                        value={paymentMethod}
                                        {...register('paymentMethod')}
                                        onChange={(event) => {
                                            setPaymentMethod(event.target.value);
                                            setValue('paymentMethod', event.target.value);
                                        }}                           
                                        label="Forma de pagamento"
                                    >
                                        <MenuItem value="BOLETO">Boleto</MenuItem>
                                        <MenuItem value="CREDIT_CARD">Cartão de crédito</MenuItem>
                                        <MenuItem value="PIX">Pix</MenuItem>
                                        <MenuItem value="Cliente define">Cliente define</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button type='submit' variant='contained'>Criar cobrança</Button>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            }


                


        </>
    )
}


export default FormCreateBilling