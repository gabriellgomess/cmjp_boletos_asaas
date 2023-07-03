import React, {useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const LinksPagamento = () => {

    const [links, setLinks] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [editData, setEditData] = React.useState(null);

    const columns = [
        {
            field: 'nome',
            headerName: 'Nome',
            width: 300,
        },
        {
            field: 'cpf_cnpj',
            headerName: 'CPF/CNPJ',
            width: 150,
            align: 'left',
        },
        {
            field: 'celular',
            headerName: 'Celular',
            width: 110,
        },
        {
            field: 'email',
            headerName: 'E-mail',
            width: 250,
            align: 'left',
        },
        {
            field: 'endereco',
            headerName: 'Endereço',
            width: 400,
            align: 'left',
            renderCell: (params) => (
                <Typography variant="body1" color="text.secondary" component="div">
                    {params.row.endereco}, {params.row.numero_endereco}, {params.row.bairro}, {params.row.cidade}, {params.row.estado}
                </Typography>
              ),
        },
        {
            field: 'cycle',
            headerName: 'Ciclo',
            width: 150,
            align: 'center',
            renderCell: (params) => (
                <Typography variant="body1" color="text.secondary" component="div">
                    {params.row.cycle === 'MONTHLY' ? 'Mensal' : ''}
                </Typography>
              ),
        },
        {
            field: 'customerID',
            headerName: 'ID do Doador',
            width: 250,
            align: 'left',            
        },
      {
        field: 'actions',
        headerName: 'Ações',
        width: 200,
        renderCell: (params) => (
            <Box sx={{display: 'flex', gap: '10px'}}>
                <Button onClick={() => handleOpen(params.row)} color="secondary" variant="contained">Editar</Button>
                <Button onClick={() => handleDelete(params.row.id)} color="primary" variant="contained">Deletar</Button>
            </Box>
        ),
      },
    ];

    const handleOpen = (data) => {
      setOpen(true);
      setEditData(data);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleDelete = (id) => {
      // chamar a API para deletar a linha baseado no id
      console.log("Deletar linha com id: ", id);
    };

    useEffect(() => {
        axios.post(`${process.env.REACT_APP_URL}/asaas.php?param=31`)
        .then((response) => {
            console.log(response.data);
            setLinks(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);
    

    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'end', margin: '15px 0'}}>
            <Button variant="contained" color='success' startIcon={<AddIcon />}>
                Adicionar link
            </Button>
            </Box>
            <DataGrid
                rows={links}
                columns={columns}
                initialState={{
                pagination: {
                    paginationModel: {
                    pageSize: 10,
                    },
                },
                }}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                disableRowSelectionOnClick
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Editar</DialogTitle>
                <DialogContent>
                    <TextField 
                        margin="dense"
                        label="Nome"
                        value={editData?.nome}
                        fullWidth
                        
                    />
                    <TextField 
                        margin="dense"
                        label="CPF/CNPJ"
                        value={editData?.cpf_cnpj}
                        fullWidth
                        
                    />
                    <TextField 
                        margin="dense"
                        label="Celular"
                        value={editData?.celular}
                        fullWidth
                        
                    />
                    <TextField 
                        margin="dense"
                        label="E-mail"
                        value={editData?.email}
                        fullWidth
                        
                    />
                    <TextField 
                        margin="dense"
                        label="Endereço"
                        value={editData?.endereco}
                        fullWidth
                        
                    />
                    <TextField 
                        margin="dense"
                        label="Ciclo"
                        value={editData?.cycle}
                        fullWidth
                        
                    />
                    <TextField 
                        margin="dense"
                        label="ID do Doador"
                        value={editData?.customerID}
                        fullWidth
                        
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={() => {
                console.log(editData);
                handleClose();
                }}>Salvar</Button>
            </DialogActions>
            </Dialog>

        </Box>
    )
}

export default LinksPagamento
