import React, { useState, useEffect, useContext } from "react";

import { useForm } from 'react-hook-form';
import axios from 'axios'
import { TextField, Button, Box, Typography, InputLabel, MenuItem, FormControl, Select, Card, CardContent, FormControlLabel, Checkbox, Divider, Autocomplete, Modal } from '@mui/material'
import {formatToCPFOrCNPJ, isCPFOrCNPJ, formatToPhone, isPhone } from 'brazilian-values'
import swal from 'sweetalert';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const FormCreateBilling = () => {
    const [clientes, setClientes] = useState([]);
    const [customerID, setCustomerID] = useState('');
    const [cpfCnpj, setCpfCnpj] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const [dadosCobranca, setDadosCobranca] = useState([]);
    
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setDadosCobranca([]);
        window.location.reload();
    }

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
                        closeModal: true
                      }
                    }
                  }).then((value) => {
                    if (value) {
                        handleOpen();
                    }
                  });
                  
            })
            .catch(error => {
                console.error(error);
            });    
    };


   return (
        <>
            <Typography sx={{textAlign: 'center'}} variant='h3'>Cobrança</Typography>
            {/* <Button onClick={handleOpen}>Open modal</Button> */}
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
                            <Box sx={{width: {xs: '100%', sm: '75%', md: '50%'}, display: 'flex', flexDirection: 'column', gap: '15px'}}>
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
                Valor: {dadosCobranca.value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Vencimento: {(dadosCobranca.dueDate)?.split('-').reverse().join('/')}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Forma de pagamento: {dadosCobranca.paymentMethod === 'BOLETO' ? 'Boleto' : dadosCobranca.paymentMethod === 'CREDIT_CARD' ? 'Cartão de crédito' : dadosCobranca.paymentMethod === 'PIX' ? 'Pix' : dadosCobranca.paymentMethod === 'UNDEFINED' ? 'Cliente define' : ''}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Link do boleto: <Button href={dadosCobranca.bankSlipUrl} target='_blank'>Abrir boleto</Button>
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Link do pagamento: <Button href={dadosCobranca.invoiceUrl} target='_blank'>Abrir pagamento</Button>
            </Typography>


        </Box>
      </Modal>
                


        </>
    )
}


export default FormCreateBilling