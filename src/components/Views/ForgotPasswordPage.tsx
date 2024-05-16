import { useState } from "react";
import { Alert, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const { handleSubmit, formState, control } = useForm({
    mode: "onChange",
  });

  const { errors } = formState;

  const handleResetPassword = async (data: any) => {
    try {
      const response = await fetch("https://motographixapi.up.railway.app/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(
          "Error al enviar el correo electrónico de restablecimiento de contraseña."
        );
      }
    } catch (error) {
      setError(
        "Error al enviar el correo electrónico de restablecimiento de contraseña."
      );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '90vh' }}>
      <h1 style={{ marginBottom: '20px' }}>¿Olvidaste tu contraseña?</h1>
      {success && (
        <Alert severity="success" style={{ marginBottom: '20px' }}>
          Se ha enviado un correo electrónico de restablecimiento de contraseña.
          Por favor, revisa tu bandeja de entrada.
        </Alert>
      )}
      {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
      <form onSubmit={handleSubmit(handleResetPassword)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Controller
          name="email"
          defaultValue=""
          control={control}
          rules={{
            required: "Correo electrónico es requerido",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              id="email-input"
              label="Correo electrónico"
              variant="outlined"
              style={{ marginBottom: '10px', width: '300px' }}
              error={!!errors.email}
              helperText={(errors?.email?.message as string) ?? ""}
              size="small"
            />
          )}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={formState.isSubmitting}
          style={{ width: '300px', marginBottom: '20px' }}
        >
          Enviar correo electrónico de restablecimiento
        </Button>
      </form>
      <Link to="/" style={{ marginBottom: '20px' }}>Volver al inicio de sesión</Link>
    </div>
  );
};

export default ForgotPasswordPage;
