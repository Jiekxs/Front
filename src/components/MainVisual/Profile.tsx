import React, { useEffect, useState } from "react";
import { Alert, Paper } from '@mui/material';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { FormValidation } from "../../auth/pages/Validations/EditUserValidateProfile";
import { Controller, useForm } from "react-hook-form";
import { vestResolver } from "@hookform/resolvers/vest";

const UserProfile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const userId: number = parseInt(sessionStorage.getItem('userId') || '0');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`https://motographixapi.up.railway.app/finduserid/${userId}`);
        if (!response.ok) {
          throw new Error("Error al obtener el perfil del usuario");
        }
        const userData = await response.json();
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    FormValidation.reset(); 
  }, []);

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


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser: any) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://motographixapi.up.railway.app/updateuser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        showAlert('error', 'Error al actualizar los datos del usuario');
        throw new Error('Error al actualizar los datos del usuario');
      }
      showAlert('success', 'Datos del usuario actualizados');
    } catch (error) {
      showAlert('error', 'Error al actualizar los datos del usuario');
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDeleteAccount = async () => {
    try {
      setOpenModal(false); // Cierra la ventana modal después de enviar la solicitud
    } catch (error) {
      showAlert('error', 'Error al eliminar cuenta');
      setOpenModal(false); // Cierra la ventana modal en caso de error
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Paper sx={{ width: "70%", margin: "auto", padding:5 }}>
<div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
        {alertData.open && (
          <Alert severity={alertData.severity} onClose={handleCloseAlert}>
            {alertData.message}
          </Alert>
        )}
      </div>
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4">Perfil de Usuario</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box mt={4}>
            <Box mb={2}>
              <Typography variant="h6">Datos del Usuario</Typography>
              <Box mt={2} p={2} border="1px solid #ccc" borderRadius={4}>
                <TextField
                  label="Nombre"
                  name="nombre"
                  value={user?.nombre || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Apellido"
                  name="apellido"
                  value={user?.apellido || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Email"
                  name="email"
                  value={user?.email || ''}
                  fullWidth
                  margin="normal"
                  disabled
                />
                <TextField
                  label="Teléfono"
                  name="telefono"
                  value={user?.telefono || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Contraseña"
                  name="contrasena"
                  value={user?.contrasena || ''}
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <Button onClick={handleTogglePasswordVisibility}>
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                      </Button>
                    ),
                  }}
                />
                <TextField
                  label="Fecha de Nacimiento"
                  name="fechaNacimiento"
                  value={user?.fechaNacimiento || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal" 
                />
                <TextField
                  label="Género"
                  name="genero"
                  value={user?.genero || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Box>
            </Box>
            <Box mt={2}>
              <Button variant="contained" color="primary" onClick={(handleUpdate)}>
                Guardar Cambios
              </Button>
              <Button variant="contained" color="error" onClick={handleOpenModal}>
                Eliminar Cuenta
              </Button>
            </Box>
          </Box>
        )}
      </Box>
        

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Eliminar Cuenta</DialogTitle>
        <DialogContent>
          <Typography variant="body1">¿Estás seguro de que quieres eliminar tu cuenta?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteAccount} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>

    </Paper>
  );
};

export default UserProfile;
