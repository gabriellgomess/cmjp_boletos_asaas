import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Draggable from "react-draggable";
import axios from "axios";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function DraggableDialog(props) {
  const { open, onClose, subscription } = props;

  const [formData, setFormData] = useState({
    object: "",
    id: "",
    dateCreated: "",
    customer: "",
    paymentLink: "",
    billingType: "",
    cycle: "",
    value: "",
    nextDueDate: "",
    description: "",
    status: "",
    discount: {
      value: "",
      dueDateLimitDays: "",
    },
    fine: {
      value: "",
    },
    interest: {
      value: "",
    },
    deleted: false,
  });

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_URL}/asaas.php?param=19`, { id: subscription })
      .then((response) => {
        console.log(response.data.data);
        setFormData(response.data.data); // Populate form data with API response
      })
      .catch((error) => {
        console.log(error);
      });
  }, [open]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Send edited data to the backend using axios.post
    axios
      .post(`${process.env.REACT_APP_URL}/updateSubscription`, formData)
      .then((response) => {
        console.log("Data updated successfully:", response.data);
        onClose(); // Close the dialog after successful update
      })
      .catch((error) => {
        console.log("Error updating data:", error);
      });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Edit Subscription {subscription}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>          
            <TextField label="ID da cobrança" name="id" id="id" value={formData.id} onChange={handleInputChange} />
            <TextField label="Data de criação" name="dateCreated" id="dateCreated" value={formData.dateCreated} onChange={handleInputChange} />
            <TextField label="Cliente" name="customer" id="customer" value={formData.customer} onChange={handleInputChange} />
            <TextField label="Link de pagamento" name="paymentLink" id="paymentLink" value={formData.paymentLink} onChange={handleInputChange} />
            <TextField label="Tipo de cobrança" name="billingType" id="billingType" value={formData.billingType} onChange={handleInputChange} />
            <TextField label="Ciclo" name="cycle" id="cycle" value={formData.cycle} onChange={handleInputChange} />
            <TextField label="Valor" name="value" id="value" value={formData.value} onChange={handleInputChange} />
            <TextField label="Próximo vencimento" name="nextDueDate" id="nextDueDate" value={formData.nextDueDate} onChange={handleInputChange} />
            <TextField label="Descrição" name="description" id="description" value={formData.description} onChange={handleInputChange} />
            <TextField label="Status" name="status" id="status" value={formData.status} onChange={handleInputChange} />
            <TextField label="Desconto" name="discount" id="discount" value={formData.discount.value} onChange={handleInputChange} />
            <TextField label="Dias para vencimento do desconto" name="dueDateLimitDays" id="dueDateLimitDays" value={formData.discount.dueDateLimitDays} onChange={handleInputChange} />
            <TextField label="Juros" name="interest" id="interest" value={formData.interest.value} onChange={handleInputChange} />
            <TextField label="Multa" name="fine" id="fine" value={formData.fine.value} onChange={handleInputChange} />
            <TextField label="Excluído" name="deleted" id="deleted" value={formData.deleted} onChange={handleInputChange} />          
            
          </form>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
