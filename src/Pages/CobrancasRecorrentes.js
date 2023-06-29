import React, { useState, useEffect } from "react";
import {
  Backdrop,
  CircularProgress,
  Typography,
  Box,
  IconButton,
  Button,
  Tooltip,
  Modal,
  Divider,
  Link
} from "@mui/material";
import axios from "axios";
import ReplayIcon from "@mui/icons-material/Replay";
import { DataGrid, ptBR } from "@mui/x-data-grid";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search';

const CobrancasRecorrentes = () => {
  const [cobrancasRecorrentes, setCobrancasRecorrentes] = useState([]);
  const [reload, setReload] = useState(false);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState([]);


  const handleCloseModal = () => setOpenModal(false);
  const handleOpenModal = (dados) => setOpenModal(true);

  const handleClose = () => setOpen(false); 
  const handleOpen = () => setOpen(true);


  const handleReload = () => {
    setReload(!reload);
  };

  useEffect(() => {
    handleOpen();
    axios
      .get(`${process.env.REACT_APP_URL}/asaas.php?param=21`)
      .then((response) => {
        setCobrancasRecorrentes(response.data.data[0]);
        handleClose();
        console.log(response.data.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reload]);

  const handleViewBillings = (id) => {
    axios.get(`${process.env.REACT_APP_URL}/asaas.php?param=20&id=${id}`)
    .then((response) => {
      console.log(response.data.data);
      setModalData(response.data.data);
      handleOpenModal();  // abrir o modal após a obtenção dos dados
    })
    .catch((err) => {
      console.log(err);
    })
  };
   

  const columns = [

    {
      field: "id",
      headerName: "ID",
      width: 200,
      // editable: true,
    },
    {
      field: "customerName",
      headerName: "Nome",
      width: 200,
      // editable: true,
    },  
    {
      field: "dateCreated",
      headerName: "Data de Criação",
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <Typography variant="body1" color="text.secondary" component="div">
          {params.row.dateCreated.split("-").reverse().join("/")}
        </Typography>
      ),
    },
    {
      field: "customer",
      headerName: "ID do Doador",
      width: 150,
      // editable: true,
    },
    {
      field: "value",
      headerName: "Valor",
      width: 150,
      disableClickEventBubbling: true,
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
      field: "status",
      headerName: "Status",
      width: 100,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <>
          {params.row.status === "ACTIVE" ? (
            <Tooltip title="Assinatura Ativa">
            <CheckCircleOutlinedIcon color="success" />
            </Tooltip>
          ) : (
            <Tooltip title="Assinatura Inativa">
            <RemoveCircleOutlineOutlinedIcon color="warning" />
            </Tooltip>
          )}
        </>
      ),
    },
    {
      field: "actions",
      headerName: "Ver",
      width: 100,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <IconButton aria-label="ver" size="large">
          <SearchIcon onClick={()=>handleViewBillings(params.row.id)} fontSize="inherit" />
        </IconButton>
      ),
    }
  ];

  return (
    <>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Typography variant="h5">Cobranças Recorrentes</Typography>
          <IconButton
            aria-label="reload"
            color="primary"
            onClick={() => handleReload()}
          >
            <ReplayIcon />
          </IconButton>
        </Box>
        <DataGrid
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          rows={cobrancasRecorrentes}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          // checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
      <Backdrop
        sx={{
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" component="div" sx={{ mt: 1 }}>
          Carregando...
        </Typography>
      </Backdrop>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',width: 400,bgcolor: 'background.paper',border: '2px solid #000',boxShadow: 24,p: 4,}}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Dados da Cobrança
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {modalData.map((item) => (
              <Box key={item.id}>
                  <Typography variant="body1" color="text.secondary" component="div">
                    Vencimento {item.dueDate.split("-").reverse().join("/")}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" component="div">
                    Valor {item.value.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}
                  </Typography>
                <Link href={item.invoiceUrl} target='blank'>Link</Link>
                  <Divider />
                </Box>
            ))}


          </Typography>
        </Box>
      </Modal>

    </>
  );
};

export default CobrancasRecorrentes;
