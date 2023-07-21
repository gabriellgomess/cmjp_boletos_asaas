import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, ptBR,  GridToolbar } from "@mui/x-data-grid";
import { Typography, Button } from "@mui/material";

const columns = [
  {
    field: "customerName",
    headerName: "Nome do Doador",
    width: 200,
    editable: true,
  },
  {
    field: "cpfCnpj",
    headerName: "CPF/CNPJ",
    width: 120,
    editable: true,
  },
  {
    field: "email",
    headerName: "E-mail",
    width: 150,
    editable: true,
  },
  {
    field: "phone",
    headerName: "Telefone",
    width: 120,
    editable: true,
  },
  {
    field: "mobilePhone",
    headerName: "Celular",
    width: 120,
    editable: true,
  },
  {
    field: "postalService",
    headerName: "Correio",
    width: 70,
    editable: true,
    renderCell: (params) => (
      <Typography variant="body1" color="text.secondary" component="div">
        {params.row.postalService ? "Sim" : "Não"}
      </Typography>
    ),
  },
  {
    field: "dueDate",
    headerName: "Vencimento",
    width: 100,
    editable: true,
    renderCell: (params) => (
      <Typography variant="body1" color="text.secondary" component="div">
        {params.row.dateCreated.split("-").reverse().join("/")}
      </Typography>
    ),
  },
  {
    field: "value",
    headerName: "Valor",
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
    field: "billingType",
    headerName: "Método",
    width: 80,
    editable: true,
  },
  {
    field: "status",
    headerName: "Status",
    width: 200,
    editable: true,
    renderCell: (params) => {
      let status = params.value; // assumindo que o status está no valor do params
      let message;
  
      switch (status) {
        case 'PENDING':
            message = "Aguardando pagamento";
            break;
        case 'RECEIVED':
            message = "Recebida (saldo já creditado na conta)";
            break;
        case 'CONFIRMED':
            message = "Pagamento confirmado (saldo ainda não creditado)";
            break;
        case 'OVERDUE':
            message = "Vencida";
            break;
        case 'REFUNDED':
            message = "Estornada";
            break;
        case 'RECEIVED_IN_CASH':
            message = "Recebida em dinheiro (não gera saldo na conta)";
            break;
        case 'REFUND_REQUESTED':
            message = "Estorno Solicitado";
            break;
        case 'REFUND_IN_PROGRESS':
            message = "Estorno em processamento (liquidação já está agendada, cobrança será estornada após executar a liquidação)";
            break;
        case 'CHARGEBACK_REQUESTED':
            message = "Recebido chargeback";
            break;
        case 'CHARGEBACK_DISPUTE':
            message = "Em disputa de chargeback (caso sejam apresentados documentos para contestação)";
            break;
        case 'AWAITING_CHARGEBACK_REVERSAL':
            message = "Disputa vencida, aguardando repasse da adquirente";
            break;
        case 'DUNNING_REQUESTED':
            message = "Em processo de negativação";
            break;
        case 'DUNNING_RECEIVED':
            message = "Recuperada";
            break;
        case 'AWAITING_RISK_ANALYSIS':
            message = "Pagamento em análise";
            break;
        default:
            message = `Status desconhecido: ${status}`;
      }
  
      return <Typography variant="body1" color="text.secondary" component="div">{message}</Typography>;
    },
  },
  
  {
    field: "invoiceUrl",
    headerName: "Link",
    width: 100,
    editable: true,
    renderCell: (params) => (
      <Button href={params.row.invoiceUrl} target="blank">
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
    <Box sx={{ height: 400, width: "100%", marginTop: "15px" }}>
      {props.billings.length > 0 ? (
        <DataGrid
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          rows={props.billings}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
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
