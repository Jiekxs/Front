import { useState } from "react";
import { Alert, Button, Card, Paper } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useForm, Controller } from "react-hook-form";
import { vestResolver } from "@hookform/resolvers/vest";
import { FormValidation } from "./Validations/LoginPageValidate";
import { Link, useNavigate } from "react-router-dom"; 

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate(); 
  const [alertData, setAlertData] = useState<{
    open: boolean;
    severity: "error" | "warning" | "info" | "success";
    message: string;
  }>({
    open: false,
    severity: "error",
    message: "",
  });

  const showAlert = (
    severity: "error" | "warning" | "info" | "success",
    message: string
  ) => {
    setAlertData({ open: true, severity, message });
    setTimeout(() => {
      setAlertData({ ...alertData, open: false });
    }, 2000);
  };

  const handleCloseAlert = () => {
    setAlertData({ ...alertData, open: false });
  };

  const { handleSubmit, formState, control } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: vestResolver(FormValidation),
  });

  const handleCheckUser = async (username: string, password: string) => {
    try {
      const response = await fetch(
        `https://motographixapi.up.railway.app/users/login?email=${username}&password=${password}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        showAlert('error', 'Usuario o contraseña incorrectos');
      }
      if (response.ok) {
        showAlert('success', 'Inicio de sesión exitoso');
      }
    } catch (error) {
        showAlert('error', 'Usuario o contraseña incorrectos');
    }
  };

  const handleLogin = async (data: any) => {
    try {
      await handleCheckUser(data.username, data.password);

      const response = await fetch("https://motographixapi.up.railway.app/loginauth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showAlert('success', 'Inicio de sesión exitoso');

        // Guardar el ID de usuario y el rol en sessionStorage
        const responseData = await response.json();

        sessionStorage.setItem("userId", responseData.idUsuario);
        sessionStorage.setItem("userRole", responseData.rol);
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("user", responseData);

        setLoggedIn(true);

        if (responseData.rol === "admin") {
          navigate("/admin/dashboard");
        }
        if (responseData.rol === "mecanico") {
          navigate("/worker/dashboard");
        }

        if (responseData.rol === "cliente") {
          navigate("/home");
        }
      } else {
        const responseData = await response.json();
        setError(responseData.message || "Error al iniciar sesión");
        showAlert('error', 'Usuario o contraseña incorrectos');

      }
    } catch (error) {
        showAlert('error', 'Error al iniciar sesión');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '90vh'}}>
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9 }}>
        {alertData.open && (
          <Alert severity={alertData.severity} onClose={handleCloseAlert}>
            {alertData.message}
          </Alert>
        )}
      </div>
      {/* <img src="../../../public/img/Logo.png" alt="logoWeb" style={{ width: '400px', height: 'auto', background:'black' }}/> */}
      <Paper sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',height:'auto', width:'50vh', padding:5, borderRadius:"25px"}}>
      <h1 style={{ marginBottom: '20px' }}>LOGIN</h1>
      {loggedIn && <h3>Inicio de sesión exitoso</h3>}
      <form onSubmit={handleSubmit(handleLogin)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="username-input"
              label="Email"
              variant="outlined"
              style={{ marginBottom: '10px', width: '300px' }}
              error={formState.errors?.username ? true : false}
              helperText={(formState.errors?.username?.message as string) ?? ""}
              size="small"
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="password-input"
              label="Password"
              variant="outlined"
              style={{ marginBottom: '10px', width: '300px' }}
              type="password"
              error={formState.errors?.password ? true : false}
              helperText={(formState.errors?.password?.message as string) ?? ""}
              size="small"
            />
          )}
        />
        <Link to="/forgot-password" style={{ marginBottom: '10px' }}>¿Olvidaste tu contraseña?</Link>
        {error && <p style={{ color: "red", marginBottom: '10px' }}></p>}
        <Button variant="contained" type="submit" style={{ width: '150px', marginBottom: '10px' }}>
          Login
        </Button>
      </form>
      <Link to="/register">
        <Button variant="contained" style={{ width: '150px' }}>Registrarse</Button>
      </Link>
      </Paper>
      
    </div>
  );
};

export default LoginPage;
