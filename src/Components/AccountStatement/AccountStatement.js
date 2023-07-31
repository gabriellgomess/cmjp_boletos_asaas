import React, { useEffect, useState } from 'react';
import axios from 'axios';
import typeDescription from './typeDescription';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Card, Typography, Box } from '@mui/material';
import { ArrowDownward } from '@mui/icons-material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from "@mui/material/styles";

function AccountStatement() {
    const [statementData, setStatementData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const [update, setUpdate] = useState(false);

    const itemsPerPage = 10;

    const loadData = () => {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_URL}/asaas.php?param=36&page=${currentPage}&limit=${itemsPerPage}`)
            .then(response => {
                if (response.data && Array.isArray(response.data.data)) {
                    setStatementData(prevData => [...prevData, ...response.data.data]);
                    setHasMore(response.data.hasMore);
                } else {
                    console.log('Received non-iterable data:', response.data);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Something went wrong!', error);
                setLoading(false);
            });
    }

    useEffect(() => {
        loadData();
    }, [currentPage, update]);

    const loadMore = () => {
        if (!loading && hasMore) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    }

    const handleUpdate = () => {
        setUpdate(!update);
    }

    return (
        <Box>
            <Box sx={{display: 'flex', }}>
              <Typography variant='h4'>Extrato da Conta</Typography>
                
            </Box>
            
            <TableContainer component={Card}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Valor</TableCell>
                            <TableCell>Saldo</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>Descrição</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {statementData.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.value < 0 ? <RemoveIcon sx={{color: "#ef5350"}} /> : <AddIcon sx={{color: "#4caf50"}} />}</TableCell>
                                <TableCell>{(item.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                <TableCell>{(item.balance).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                <TableCell>{typeDescription[item.type] || item.type}</TableCell>
                                <TableCell>{(item.date).split('-').reverse().join('/')}</TableCell>
                                <TableCell>{item.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {hasMore && !loading && 
                <Button sx={{marginTop: 3}} onClick={loadMore} endIcon={<ArrowDownward />} variant="contained" color="primary">
                    Carregar mais
                </Button>
            }
            {loading && <CircularProgress />}
        </Box>
    );
}

export default AccountStatement;
