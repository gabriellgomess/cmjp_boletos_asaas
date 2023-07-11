import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, ptBR  } from '@mui/x-data-grid';
import { Typography, Button } from '@mui/material';

const columns = [  
  {
    field: 'customer',
    headerName: 'ID do Doador',
    width: 150,
    editable: true,
  },
  {
    field: 'dueDate',
    headerName: 'Vencimento',
    width: 150,
    editable: true,
    renderCell: (params) => (
        <Typography variant="body1" color="text.secondary" component="div">
          {params.row.dateCreated.split("-").reverse().join("/")}
        </Typography>
      ),
  },
  {
    field: 'value',
    headerName: 'Valor',
    width: 110,
    editable: true,
    renderCell: (params) => (
        <Typography variant="body1" color="text.secondary" component="div">
          {params.row.value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Typography>
      ),
    
  },
  {
    field: 'billingType',
    headerName: 'Forma de Pagamento',
    width: 150,
    editable: true,
    },
    {
        field: 'invoiceUrl',
        headerName: 'Link do Pagamento',
        width: 150,
        editable: true,
        renderCell: (params) => (
            <Button href={params.row.invoiceUrl} target='blank'>
                Link
            </Button>
          ),
    },
    // {
    //     field: 'actions',
    //     headerName: 'Ações',
    //     width: 150,
    //     editable: true,
    //     renderCell: (params) => (
    //         <Button>
    //             Ver
    //         </Button>
    //       ),
    // },
];

export default function TableBillings(props) {
  return (
    <Box sx={{ height: 400, width: '100%', marginTop: '15px' }}>
    {props.billings.length > 0 ? (
      <DataGrid
      localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        rows={props.billings}
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
    ) : (
        <Typography variant="body1" color="text.secondary" component="div">
            Nenhum dado foi retornado para a pesquisa realizada.
        </Typography>
    )}
    </Box>
  );
}