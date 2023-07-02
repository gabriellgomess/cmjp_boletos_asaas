import React from "react";
import { 
    Box,
    Typography,     
    Card, 
    CardContent ,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Skeleton,
    LinearProgress
} from '@mui/material';

import axios from 'axios';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useForm, Controller } from 'react-hook-form'; 

import { useTheme } from "@mui/material/styles";

import TableBillings from "../TableBillings/TableBillings";

const Billings = () => {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm();
    const theme = useTheme();
    const [billings, setBillings] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const onSubmit = (data) => {
        setBillings([]);
        console.log(data);
        setLoading(true);
        axios.post(`${process.env.REACT_APP_URL}/asaas.php?param=11`, data)
            .then(response => {
                console.log(response.data.data);
                setBillings(response.data.data);
                setLoading(false);
            }
        );
    }

    const total = billings.reduce((acc, billing) => {
        return acc + billing.value;
    }, 0);

    const handleClear = () => {
        reset();
    }
    return (
        <Box>
             <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography variant='h5'>Filtros</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: '15px'}}>
                            <FormControl sx={{width: {xs: '100%', sm: '100%', md: '49%'}}}>
                                <InputLabel id="demo-simple-select-label">Forma de Pagamento</InputLabel>
                                <Controller
                                    name="billingType"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Forma de Pagamento"
                                        >
                                            <MenuItem value="BOLETO">Boleto</MenuItem>
                                            <MenuItem value="CREDIT_CARD">Cartão de Crédito</MenuItem>
                                            <MenuItem value="PIX">Pix</MenuItem>
                                            <MenuItem value="UNDEFINED">Usuário define</MenuItem>
                                        </Select>
                                    )}
                                />
                            </FormControl>
                            <FormControl sx={{width: {xs: '100%', sm: '100%', md: '49%'}}}>
                                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                <Controller
                                    name="status"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Status"
                                        >
                                            <MenuItem value="PENDING">Aguardando pagamento</MenuItem>
                                            <MenuItem value="RECEIVED">Recebida (saldo já creditado na conta)</MenuItem>
                                            <MenuItem value="CONFIRMED">Pagamento confirmado (saldo ainda não creditado)</MenuItem>
                                            <MenuItem value="OVERDUE">Vencida</MenuItem>
                                        </Select>
                                    )}
                                />
                            </FormControl>
                            <Box sx={{border: `1px solid ${theme.palette.accent.light}`, borderRadius: '8px', padding: '10px', width: '32%'}}>
                                <Typography variant="subtitle1">Data de Criação</Typography>
                                <Box sx={{display: 'flex', gap: '10px'}}>
                                   <TextField type="date" {...register("createdDateInicial")} label="De" InputLabelProps={{ shrink: true }}/> 
                                   <TextField type="date" {...register("createdDateFinal")} label="Até" InputLabelProps={{ shrink: true }}/> 
                                </Box>                                
                            </Box>
                            <Box sx={{border: `1px solid ${theme.palette.accent.light}`, borderRadius: '8px', padding: '10px', width: '32%'}}>
                                <Typography variant="subtitle1">Data de Vencimento</Typography>
                                <Box sx={{display: 'flex', gap: '10px'}}>
                                   <TextField type="date" {...register("dueDatenicial")} label="De" InputLabelProps={{ shrink: true }}/> 
                                   <TextField type="date" {...register("dueDateFinal")} label="Até" InputLabelProps={{ shrink: true }}/> 
                                </Box>                                
                            </Box>
                            <Box sx={{border: `1px solid ${theme.palette.accent.light}`, borderRadius: '8px', padding: '10px', width: '32%'}}>
                                <Typography variant="subtitle1">Data de Pagamento</Typography>
                                <Box sx={{display: 'flex', gap: '10px'}}>
                                   <TextField type="date" {...register("receivedDateInicial")} label="De" InputLabelProps={{ shrink: true }}/> 
                                   <TextField type="date" {...register("receivedDateFinal")} label="Até" InputLabelProps={{ shrink: true }}/> 
                                </Box>                                
                            </Box>                            
                        </Box>                        
                        <Button sx={{marginTop: '15px'}} variant='contained' type="submit">Filtrar</Button>
                        <Button sx={{marginTop: '15px', marginLeft: '15px'}} variant='outlined' onClick={()=>handleClear()}>Limpar</Button>
                    </form>
                </AccordionDetails>
            </Accordion>
            {billings.length > 0 ?(
                <>
                <TextField sx={{marginTop: '15px'}} disabled label="Total" value={total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}/>
                <TableBillings billings={billings}/>                
                </>              
                
            ):(
                null
            )}
            {loading?(
                <Box sx={{width: '100%'}}>
                <LinearProgress />
            </Box>
            ):(
                null
            )}
            
           
        </Box>
    );
}

export default Billings;
