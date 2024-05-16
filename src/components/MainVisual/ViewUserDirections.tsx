import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";

interface Address {
  idDireccion: number;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
}

const UserAddresses: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [editedAddress, setEditedAddress] = useState<Address>({
    idDireccion: 0,
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    pais: "",
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedAddressToDelete, setSelectedAddressToDelete] =
    useState<Address | null>(null);

  const userId: number = parseInt(sessionStorage.getItem("userId") || "0");

  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        const response = await fetch(
          `https://motographixapi.up.railway.app/direccionesuser/${userId}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener las direcciones del usuario");
        }
        const addressesData = await response.json();
        setAddresses(addressesData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las direcciones del usuario:", error);
        setLoading(false);
      }
    };

    fetchUserAddresses();
  }, [userId]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditModalOpen(false);
  };

  const handleAddAddress = async () => {
    try {
      const response = await fetch("https://motographixapi.up.railway.app/savedireccion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editedAddress,
          user: {
            idUsuario: userId,
          },
        }),
      });
      if (!response.ok) {
        throw new Error("Error al agregar la dirección");
      }
      const newAddress = await response.json();
      setAddresses([...addresses, newAddress]);
      setOpenModal(false);
    } catch (error) {
      console.error("Error al agregar la dirección:", error);
      setOpenModal(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setEditedAddress(address);
    setEditModalOpen(true);
  };
  const handleOpenDeleteModal = (address: Address) => {
    setSelectedAddressToDelete(address);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedAddressToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleConfirmDeleteAddress = async () => {
    try {
      const response = await fetch(
        `https://motographixapi.up.railway.app/deletedireccion/${selectedAddressToDelete?.idDireccion}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar la dirección");
      }
      const updatedAddresses = addresses.filter(
        (address) =>
          address.idDireccion !== selectedAddressToDelete?.idDireccion
      );
      setAddresses(updatedAddresses);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar la dirección:", error);
      setDeleteModalOpen(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `https://motographixapi.up.railway.app/updatedireccion/${selectedAddress?.idDireccion}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editedAddress,
            user: {
              idUsuario: userId,
            },
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar la dirección");
      }
      const updatedAddress = await response.json();
      const updatedAddresses = addresses.map((address) =>
        address.idDireccion === selectedAddress?.idDireccion
          ? updatedAddress
          : address
      );
      setAddresses(updatedAddresses);
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar la dirección:", error);
      setEditModalOpen(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4">Direcciones</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Agregar Nueva Dirección
        </Button>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box mt={4} display="flex" flexWrap="wrap">
            {addresses.length === 0 ? (
              <Typography variant="body1">No hay direcciones</Typography>
            ) : (
              addresses.map((address, index) => (
                <Box
                  key={index}
                  mt={2}
                  p={2}
                  border="1px solid #ccc"
                  borderRadius={4}
                  width="calc(33.33% - 16px)"
                  marginRight={2}
                  marginBottom={2}
                >
                  <Typography variant="h6">Dirección {index + 1}</Typography>
                  <Typography>{`Calle: ${address.direccion}`}</Typography>
                  <Typography>{`Ciudad: ${address.ciudad}`}</Typography>
                  <Typography>{`C.P: ${address.codigoPostal}`}</Typography>
                  <Typography>{`País: ${address.pais}`}</Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditAddress(address)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleOpenDeleteModal(address)}
                  >
                    Eliminar
                  </Button>
                </Box>
              ))
            )}
          </Box>
        )}
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal}>
        {/* Contenido del modal para agregar dirección */}
      </Dialog>
      <Dialog open={editModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Editar Dirección</DialogTitle>
        <DialogContent>
          <TextField
            label="Calle"
            name="direccion"
            value={editedAddress.direccion}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Ciudad"
            name="ciudad"
            value={editedAddress.ciudad}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="C.P"
            name="codigoPostal"
            value={editedAddress.codigoPostal}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="País"
            name="pais"
            value={editedAddress.pais}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Agregar Nueva Dirección</DialogTitle>
        <DialogContent>
          <TextField
            label="Calle"
            name="direccion"
            value={editedAddress.direccion}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Ciudad"
            name="ciudad"
            value={editedAddress.ciudad}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="C.P"
            name="codigoPostal"
            value={editedAddress.codigoPostal}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="País"
            name="pais"
            value={editedAddress.pais}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddAddress} color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteModalOpen} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que quieres eliminar esta dirección?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDeleteAddress} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserAddresses;
