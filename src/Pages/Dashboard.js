import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography } from '@mui/material';

import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TagIcon from '@mui/icons-material/Tag';

const DashBoard = () => {

    const [balance, setBalance] = useState([0]);
    const [pending, setPending] = useState([0]);
    const [paymentLinks, setPaymentLinks] = useState([]);

    useEffect(() => {
        axios
        .get(`${process.env.REACT_APP_URL}/asaas.php?param=25`)
        .then((response) => {
            setBalance(response.data.balance);
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        axios
        .get(`${process.env.REACT_APP_URL}/asaas.php?param=26`)
        .then((response) => {
            setPending(response.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        axios
        .get(`${process.env.REACT_APP_URL}/asaas.php?param=28`)
        .then((response) => {
            setPaymentLinks(response.data);
            console.log(response.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    return (
        <Box sx={{display: 'flex', justifyContent: 'center',flexDirection: 'column', alignItems: 'center'}}>
            <Typography variant='h3'>Dashboard</Typography>
            <Box>
            <Card sx={{width: '300px', margin: {xs: '20px auto', sm: '20px 0', md: '20px 0'} }}>
                <CardContent>
                    <MonetizationOnIcon />                  
                    <Typography variant="h3" color="text.success">
                        {balance?.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                    </Typography>
                    <Typography variant="h5" color="text.secondary">
                        Saldo atual
                    </Typography>
                </CardContent>
            </Card>
            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: {xs: 'center', sm: 'start', md: 'start'}}}>
            <Card sx={{width: '300px'}}>
                <CardContent>
                    <TagIcon />                  
                    <Typography variant="h4" color="text.warning">
                        {pending.quantity}
                    </Typography>
                    <Typography variant="h5" color="text.secondary">
                        Quantidade
                    </Typography>
                </CardContent>
            </Card>
            <Card sx={{width: '300px'}}>
                <CardContent>
                    <MonetizationOnIcon />                  
                    <Typography variant="h4" color="text.secondary">
                        {pending.value?.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                    </Typography>
                    <Typography variant="h5" color="text.secondary">
                        Valor bruto
                    </Typography>
                </CardContent>
            </Card>
            <Card sx={{width: '300px'}}>
                <CardContent>
                    <MonetizationOnIcon />                  
                    <Typography variant="h4" color="text.secondary">
                        {pending.netValue?.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                    </Typography>
                    <Typography variant="h5" color="text.secondary">
                        Valor pós taxas
                    </Typography>
                </CardContent>
            </Card>
            <Card sx={{width: '300px'}}>
                <CardContent>
                <TagIcon />                 
                    <Typography variant="h4" color="text.secondary">
                        {paymentLinks.totalCount}
                    </Typography>
                    <Typography variant="h5" color="text.secondary">
                        Links de pagamento
                    </Typography>
                </CardContent>
            </Card>
            </Box>
            </Box>
        </Box>
    );

}

export default DashBoard;