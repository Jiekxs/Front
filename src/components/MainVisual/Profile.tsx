import React, { useEffect, useState } from "react";
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

const UserProfile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const userId: number = parseInt(sessionStorage.getItem('userId') || '0');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8080/finduserid/${userId}`);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser: any) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/updateuser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar los datos del usuario');
      }
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
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
      // Aquí puedes enviar la solicitud de eliminar cuenta al servidor
      console.log("Solicitud de eliminar cuenta enviada");
      setOpenModal(false); // Cierra la ventana modal después de enviar la solicitud
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      setOpenModal(false); // Cierra la ventana modal en caso de error
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
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
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Guardar Cambios
              </Button>
              <Button variant="contained" color="secondary" onClick={handleOpenModal}>
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
  );
};

export default UserProfile;
