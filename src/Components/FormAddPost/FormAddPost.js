import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import swal from "sweetalert";

const FormComponent = () => {
  const [isLoading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/posts", data);

      if (response.status === 200) {
        swal("Success!", "Post created successfully.", "success")
      } else {
        swal("Erro!", "Ocorreu um erro, por favor, tente novamente.", "error");
      }
    } catch (error) {
      swal("Erro!", "Ocorreu um erro, por favor, tente novamente.", "error");
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "100%", md: "70%", lg: "50%", xl: "50%" },
        margin: "0 auto",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4">Adicionar Post</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            rules={{ required: "O título é um campo obrigatório" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Título"
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            defaultValue=""
            rules={{ required: "A descrição é obrigatória" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Descrição"
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
          <Controller
            name="category"
            control={control}
            defaultValue=""
            rules={{ required: "Defina uma categoria para o post" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Categoria"
                error={!!errors.category}
                helperText={errors.category?.message}
              />
            )}
          />
          <Controller
            name="image"
            control={control}
            defaultValue=""
            rules={{ required: "Por favor, adicione uma imagem" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Imagem"
                error={!!errors.image}
                helperText={errors.image?.message}
              />
            )}
          />
          <Controller
            name="link_1"
            control={control}
            defaultValue=""
            rules={{ required: "Coloque o link do gateway de pagamento 1" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Link 1"
                error={!!errors.link_1}
                helperText={errors.link_1?.message}
              />
            )}
          />
          <Controller
            name="link_2"
            control={control}
            defaultValue=""
            rules={{ required: "Coloque o link do gateway de pagamento 2" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Link 2"
                error={!!errors.link_2}
                helperText={errors.link_2?.message}
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            defaultValue=""
            rules={{ required: "Defina o status do post" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Status"
                error={!!errors.status}
                helperText={errors.status?.message}
              />
            )}
          />
          <Controller
            name="date_created"
            control={control}
            defaultValue=""
            rules={{ required: "Coloque a data" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Data"
                error={!!errors.date_created}
                helperText={errors.date_created?.message}
              />
            )}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Enviar"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default FormComponent;
