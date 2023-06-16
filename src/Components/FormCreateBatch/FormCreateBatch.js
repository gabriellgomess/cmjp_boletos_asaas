import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useDropzone } from "react-dropzone";
import { read, utils } from "xlsx";
import moment from "moment";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

const FormCreateBatch = () => {
  const theme = useTheme();
  const [cobrar, setCobrar] = useState([]);
  const [update, setUpdate] = useState(false);
  // States para o modal de edição ------------
  const [open, setOpen] = useState(false);
  const [dadosEditados, setDadosEditados] = useState({
    nome: "",
    cpf_cnpj: "",
    celular: "",
    email: "",
    endereco: "",
    numero_endereco: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    notificacao: "",
    correio: "",
    valor: "",
    customerID: "",
    billingType: "",
    nextDueDate: "",
    cycle: "",
  });
  const handleClickOpen = (
    id,
    nome,
    cpf_cnpj,
    celular,
    email,
    endereco,
    numero_endereco,
    bairro,
    cidade,
    estado,
    cep,
    notificacao,
    correio,
    valor,
    customerID,
    billingType,
    nextDueDate,
    cycle
  ) => {
    setOpen(true);
    const cpfCnpjSemFormatacao = cpf_cnpj.replace(/[.-/\s]/g, "");
    setDadosEditados({
      id: id,
      nome: nome,
      cpf_cnpj: cpfCnpjSemFormatacao,
      celular: celular,
      email: email,
      endereco: endereco,
      numero_endereco: numero_endereco,
      bairro: bairro,
      cidade: cidade,
      estado: estado,
      cep: cep,
      notificacao: notificacao,
      correio: correio,
      valor: valor,
      customerID: customerID,
      billingType: billingType,
      nextDueDate: nextDueDate,
      cycle: cycle,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setDadosEditados({
      id: "",
      nome: "",
      cpf_cnpj: "",
      celular: "",
      email: "",
      endereco: "",
      numero_endereco: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      notificacao: "",
      correio: "",
      valor: "",
      customerID: "",
      billingType: "",
      nextDueDate: "",
      cycle: "",
    });
  };

  // ------------------------------------------

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL}/listar_lote.php`)
      .then((response) => setCobrar(response.data))
      .catch((error) => console.error("Error:", error));
  }, [update]);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result;
        const workbook = read(binaryStr, { type: "binary" });

        workbook.SheetNames.forEach((sheetName) => {
          let sheetToJson = utils.sheet_to_json(workbook.Sheets[sheetName]);

          // Converter o número de série do Excel para uma data
          sheetToJson = sheetToJson.map((row) => {
            const excelDate = row["nextDueDate"];
            const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);

            // Ajustar a data ao formato 'yyyy-mm-dd'
            const formattedDate = date.toISOString().split("T")[0];

            return {
              ...row,
              nextDueDate: formattedDate,
            };
          });

          axios
            .post(`${process.env.REACT_APP_URL}/carga_lote.php`, sheetToJson)
            .then((response) => {
              setUpdate(!update);
            });
        });
      };

      reader.readAsBinaryString(file);
    });
  }, []);
  
  const handleGerarCobrancas = () => {
    /* The above code is making a POST request to a PHP file named "cobrar_clientes.php" located at the
    URL specified in the environment variable "REACT_APP_URL". It is using the axios library to make
    the request. If the request is successful, it will log the response data to the console and
    reload the current page. If there is an error, it will be caught and handled. */
    axios
      .post(`${process.env.REACT_APP_URL}/asaas.php?param=24`)
      .then((response) => {
        console.log(response.data);        
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleDeleteBilling = (id) => {
    axios
      .post(`${process.env.REACT_APP_URL}/deletar_cobranca.php`, { id: id })
      .then((response) => {
        console.log(response.data);
        if (response.data && response.data === "success") {
          window.location.reload();
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleSendEditValues = () => {
    axios
      .post(`${process.env.REACT_APP_URL}/editar_cobranca.php`, dadosEditados)
      .then((response) => {
        console.log(response.data);
        // if (response.data && response.data === "success") {
        //   window.location.reload();
        // }
      })
      .catch((error) => console.error("Error:", error));
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <>
      <Box
        sx={{
          bgColor: theme.palette.background.default,
          width: { xs: "100%", sm: "100%", md: "50%" },
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          margin: "0 auto",
          paddingTop: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: theme.palette.text.primary, textAlign: "center" }}
        >
          Cadastro de Lote
        </Typography>
        <div
          style={{
            border: "3px dashed lightgrey",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "20px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <Typography sx={{ display: "flex", alignItems: "center" }}>
            Arraste e solte algum arquivo aqui, ou clique para selecionar
            arquivos <FileUploadIcon />
          </Typography>
        </div>
        {acceptedFiles.map((file) => (
          <Typography
            key={file.path}
            sx={{ color: theme.palette.text.primary }}
          >
            {file.path}
          </Typography>
        ))}
        {/* Link para baixar o arquivo modelo */}
        <Typography
          sx={{
            color: theme.palette.text.primary,
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
          component="a"
          href={`${process.env.REACT_APP_URL}/cliente_doacao_modelo.xlsx`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Baixe o arquivo modelo <DownloadIcon />
        </Typography>
      </Box>
      <TableContainer sx={{ marginTop: 3 }} component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>CPF/CNPJ</TableCell>
              <TableCell>Celular</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Número</TableCell>
              <TableCell>Bairro</TableCell>
              <TableCell>Cidade</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>CEP</TableCell>
              <TableCell>Notificação</TableCell>
              <TableCell>Correio</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Customer ID</TableCell>
              <TableCell>Billing Type</TableCell>
              <TableCell>Next Due Date</TableCell>
              <TableCell>Cycle</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cobrar.map((row) => {
              const valorFormatado = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(row.valor);
              const nextDueDateFormatado = moment(row.nextDueDate).format(
                "DD/MM/YYYY"
              );
              return (
                <TableRow
                  key={row.nome}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.nome}
                  </TableCell>
                  <TableCell>{row.cpf_cnpj}</TableCell>
                  <TableCell>{row.celular}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.endereco}</TableCell>
                  <TableCell>{row.numero_endereco}</TableCell>
                  <TableCell>{row.bairro}</TableCell>
                  <TableCell>{row.cidade}</TableCell>
                  <TableCell>{row.estado}</TableCell>
                  <TableCell>{row.cep}</TableCell>
                  <TableCell>{row.notificacao}</TableCell>
                  <TableCell>{row.correio}</TableCell>
                  <TableCell>{valorFormatado}</TableCell>
                  <TableCell>{row.customerID}</TableCell>
                  <TableCell>{row.billingType}</TableCell>
                  <TableCell>{nextDueDateFormatado}</TableCell>
                  <TableCell>{row.cycle}</TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton
                        aria-label="editar"
                        sx={{ color: theme.palette.primary.dark }}
                        onClick={() =>
                          handleClickOpen(
                            row.id,
                            row.nome,
                            row.cpf_cnpj,
                            row.celular,
                            row.email,
                            row.endereco,
                            row.numero_endereco,
                            row.bairro,
                            row.cidade,
                            row.estado,
                            row.cep,
                            row.notificacao,
                            row.correio,
                            row.valor,
                            row.customerID,
                            row.billingType,
                            row.nextDueDate,
                            row.cycle
                          )
                        }
                      >
                        <ModeEditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Apagar">
                      <IconButton
                        aria-label="apagar"
                        color="error"
                        onClick={() => handleDeleteBilling(row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        disabled={cobrar.length > 0 ? false : true}
        sx={{ marginTop: 3 }}
        variant="contained"
        onClick={() => handleGerarCobrancas()}
      >
        Gerar Cobranças
      </Button>

      {/* -------------------- MODAL -------------------- */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle color="primary">Editar Cobrança</DialogTitle>
        <DialogContent>
          <DialogContentText>Editar dados da cobrança</DialogContentText>
          <TextField
            type="text"
            margin="dense"
            id="id"
            label="ID"
            fullWidth
            value={dadosEditados.id}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, id: e.target.value })
            }
            disabled
          />
          <TextField
            type="text"
            margin="dense"
            id="nome"
            label="Nome"
            fullWidth
            value={dadosEditados.nome}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, nome: e.target.value })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="cpf_cnpj"
            label="CPF/CNPJ"
            fullWidth
            value={dadosEditados.cpf_cnpj}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, cpf_cnpj: e.target.value })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="celular"
            label="Celular"
            fullWidth
            value={dadosEditados.celular}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, celular: e.target.value })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="email"
            label="Email"
            fullWidth
            value={dadosEditados.email}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, email: e.target.value })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="endereco"
            label="Endereço"
            fullWidth
            value={dadosEditados.endereco}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, endereco: e.target.value })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="numero_endereco"
            label="Número"
            fullWidth
            value={dadosEditados.numero_endereco}
            onChange={(e) =>
              setDadosEditados({
                ...dadosEditados,
                numero_endereco: e.target.value,
              })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="bairro"
            label="Bairro"
            fullWidth
            value={dadosEditados.bairro}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, bairro: e.target.value })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="cidade"
            label="Cidade"
            fullWidth
            value={dadosEditados.cidade}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, cidade: e.target.value })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="estado"
            label="Estado"
            fullWidth
            value={dadosEditados.estado}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, estado: e.target.value })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="cep"
            label="CEP"
            fullWidth
            value={dadosEditados.cep}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, cep: e.target.value })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="notificacao"
            label="Notificação"
            fullWidth
            value={dadosEditados.notificacao}
            onChange={(e) =>
              setDadosEditados({
                ...dadosEditados,
                notificacao: e.target.value,
              })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="correio"
            label="Correio"
            fullWidth
            value={dadosEditados.correio}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, correio: e.target.value })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="valor"
            label="Valor"
            fullWidth
            value={dadosEditados.valor}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, valor: e.target.value })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="customerID"
            label="Customer ID"
            fullWidth
            value={dadosEditados.customerID}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, customerID: e.target.value })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="billingType"
            label="Billing Type"
            fullWidth
            value={dadosEditados.billingType}
            onChange={(e) =>
              setDadosEditados({
                ...dadosEditados,
                billingType: e.target.value,
              })
            }
          />
          <TextField
            type="date"
            margin="dense"
            id="nextDueDate"
            label="Next Due Date"
            fullWidth
            value={dadosEditados.nextDueDate}
            onChange={(e) =>
              setDadosEditados({
                ...dadosEditados,
                nextDueDate: e.target.value,
              })
            }
          />
          <TextField
            type="text"
            margin="dense"
            id="cycle"
            label="Cycle"
            fullWidth
            value={dadosEditados.cycle}
            onChange={(e) =>
              setDadosEditados({ ...dadosEditados, cycle: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fechar</Button>
          <Button onClick={() => handleSendEditValues()}>Alterar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FormCreateBatch;
