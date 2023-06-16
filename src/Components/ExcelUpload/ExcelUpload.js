import React from 'react';
import { useDropzone } from 'react-dropzone';
import { ExcelRenderer } from 'react-excel-renderer';
import axios from 'axios';

const ExcelUpload = () => {
  const {getRootProps, getInputProps} = useDropzone({
    accept: '.xlsx,.xls',
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        
        reader.onload = function(evt) {
          const data = evt.target.result;
          
          const workbook = ExcelRenderer(data);

          // Você pode fazer algo com os dados do Excel aqui.
          // Por exemplo, imprimir a primeira linha da primeira planilha:
          console.log(workbook.Sheets[workbook.SheetNames[0]]['1']);
          
          const formData = new FormData();
          formData.append('file', new Blob([data], {type: 'application/vnd.ms-excel'}));
          
          axios.post(`${process.env.REACT_APP_URL}salva_cliente.php`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(response => {
            console.log(response);
          }).catch(error => {
            console.log(error);
          });
        };
        
        reader.readAsArrayBuffer(file);
      });
    }
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Clique ou arraste um arquivo para essa área para fazer upload</p>
    </div>
  );
};

export default ExcelUpload;
