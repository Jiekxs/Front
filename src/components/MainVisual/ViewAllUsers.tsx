import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Alert, IconButton, Paper, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import { vestResolver } from "@hookform/resolvers/vest";
import { FormValidation } from "../../auth/pages/Validations/EditUserValidate";
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import { Display } from "react-bootstrap-icons";
 
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const ViewAllUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openAddressModel, setOpenAddressModal] = useState<boolean>(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [deletedUserEmail, setDeletedUserEmail] = useState<string>("");
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false); 
  const [userAddresses, setUserAddresses] = useState<any[]>([]); 
  const [alertData, setAlertData] = useState<{ open: boolean, severity: 'error' | 'warning' | 'info' | 'success', message: string }>({
    open: false,
    severity: 'error',
    message: ''
  });

  const { control, handleSubmit, reset, formState } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: vestResolver(FormValidation),
  });

  const showAlert = (severity: 'error' | 'warning' | 'info' | 'success', message: string) => {
    setAlertData({ open: true, severity, message });
    setTimeout(() => {
      setAlertData({ ...alertData, open: false });
    }, 1500);
  };

  const handleCloseAlert = () => {
    setAlertData({ ...alertData, open: false });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://motographixapi.up.railway.app/users");
        if (!response.ok) {
          throw new Error("Error al obtener los usuarios");
        }
        const data = await response.json();
        setUsers(data); 
        setLoading(false);
      } catch (error) {
        showAlert('error', 'Error al obtener los usuarios');

        console.error("Error al obtener los usuarios:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: number, email: string) => {
    setUserIdToDelete(id);
    setDeletedUserEmail(email);
    setOpenModal(true);
  };

  const handleEdit = (userId: number) => {
    setSelectedUserId(userId);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedUserId(null);
  };

  const handleCancelEdit = () => {
    setOpenEditModal(false);
    setSelectedUserId(null);
    reset();
  };

  const handleAddUser = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    
    setOpenAddModal(false);
  };

  const handleCancelAddUser = () => {
    handleCloseAddModal(); 
    reset(); 
  };


  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `https://motographixapi.up.railway.app/deleteuser/${userIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar el usuario");
      }
      if(response.ok){
        showAlert('success', 'Usuario Borrado correctamente');
      }

      setUsers(users.filter((user) => user.idUsuario !== userIdToDelete));
    } catch (error) {
      showAlert('error', 'Error al eliminar el usuario');

      console.error("Error al eliminar el usuario:", error);
    } finally {
      setOpenModal(false);
    }
  };

  const handleUpdate = async (formData: any) => {
    try {
      const updatedData = { ...formData, idUsuario: selectedUserId }; 

      
      const response = await fetch(
        `https://motographixapi.up.railway.app/updateuser/${selectedUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar el usuario");
      }

      if(response.ok){
        showAlert('success', 'Usuario Actualizdo correctamente');
      }

      const updatedUser = await response.json();
      setUsers(
        users.map((user) =>
          user.idUsuario === selectedUserId ? { ...user, ...updatedUser } : user
        )
      );

      setOpenEditModal(false);
      setSelectedUserId(null);
      reset();
    } catch (error) {
      showAlert('error', 'Error al actualizar el usuario');

      console.error("Error al actualizar el usuario:", error);
    }
  };

  const handleAddUserSubmit = async (formData: any) => {
    try {
      const response = await fetch("https://motographixapi.up.railway.app/saveuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        showAlert('error', 'Error al agregar el usuario');

        throw new Error(`Error al agregar el usuario: ${response.statusText}`);
      }
      if(response.ok){
        showAlert('success', 'Usuario Guardado correctamente');
      }

      const newUser = await response.json();
      setUsers([...users, newUser]);
      setOpenAddModal(false);
      reset();
    } catch (error) {
      showAlert('error', 'No se ha posido agregar el usuario');
    }
  };

  const fetchAddresses = async (userId: number) => {
    try {
      const response = await fetch(`https://motographixapi.up.railway.app/direccionesuser/${userId}`);
      if (!response.ok) {
        throw new Error("Usuario Sin direcciones");
      }
      const data = await response.json();
      setUserAddresses(data);
      setOpenAddressModal(true); 
    } catch (error) {
      showAlert('warning', 'Sin direcciones que mostrar');
    }
  };
  

  const fieldsConfig = [
    { name: "nombre", label: "Nombre" },
    { name: "apellido", label: "Apellido" },
    { name: "email", label: "Email" },
    { name: "telefono", label: "Telefono" },
    { name: "fechaNacimiento", label: "Cumpleaños" },
    { name: "genero", label: "Sexo" },
    { name: "rol", label: "Rol" },
  ];

  const columns: GridColDef[] = [
    { field: "nombre", headerName: "Nombre", flex:1 },
    { field: "apellido", headerName: "Apellido", flex:1 },
    { field: "email", headerName: "Email", flex:1 },
    { field: "telefono", headerName: "Teléfono", flex:1 },
    { field: "fechaNacimiento", headerName: "Cumpleaños", flex:1 },
    { field: "genero", headerName: "Sexo", flex:1},
    { field: "fechaRegistro", headerName: "Registro", flex:1 },
    { field: "rol", headerName: "Rol", flex:1 },
    {
      field: "editar",
      headerName: "Editar",
      flex:0.6,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton onClick={() => handleEdit(params.row.idUsuario)}>
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "borrar",
      headerName: "Eliminar",
      flex:0.6,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          onClick={() => handleDelete(params.row.idUsuario, params.row.email)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
    {
      field: "direcciones",
      headerName: "Direcciones",
      flex:1,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton onClick={() => fetchAddresses(params.row.idUsuario)}>
        <MapsHomeWorkIcon />
      </IconButton>
      ),
    },
  ];

  return (
    <>
    <Paper sx={{ width: "90%", margin: "auto", padding:5 }}>
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
        {alertData.open && (
          <Alert severity={alertData.severity} onClose={handleCloseAlert}>
            {alertData.message}
          </Alert>
        )}
      </div>
      <h2>Usuarios</h2>
      <Button variant="contained" color="primary" onClick={handleAddUser}>Nuevo usuario</Button>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <div style={{ height: "auto", width: "100%" }}>
        <DataGrid
          rows={users.map((user, index) => ({ ...user, id: index + 1 }))} 
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10,20,30]}
        />
      </div>
      
      
      )}
      </Paper>
      <br />
      <Modal
        open={openModal}
        onClose={() => {
          {
            setOpenModal(false);
          }
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" id="modal-title">
            Confirmar eliminación de usuario
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            ¿Estás seguro de que deseas eliminar el usuario{" "}
            <b>{deletedUserEmail}</b> ?
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="error" onClick={confirmDelete}>
              Confirmar
            </Button>
            <Button
              sx={{ marginLeft: 1 }}
              variant="contained"
              onClick={() => setOpenModal(false)}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openEditModal}
        onClose={() => {
          handleCloseEditModal();
          handleCancelEdit();
        }}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" id="edit-modal-title">
            Editar Usuario
          </Typography>
          {selectedUserId !== null && (
            <form onSubmit={handleSubmit(handleUpdate)}>
              <div>
                {fieldsConfig.map((fieldsConfig, index) => (
                  <div key={index}>
                    <Controller
                      name={fieldsConfig.name}
                      control={control}
                      defaultValue={
                        users.find(
                          (user) => user.idUsuario === selectedUserId
                        )?.[fieldsConfig.name] || ""
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id={`${fieldsConfig.name}-input`}
                          label={fieldsConfig.label}
                          variant="outlined"
                          sx={{ m: 2 }}
                          size="small"
                          error={
                            formState.errors?.[fieldsConfig.name] ? true : false
                          }
                          helperText={
                            (formState.errors?.[fieldsConfig.name]
                              ?.message as string) ?? ""
                          }
                        />
                      )}
                    />
                  </div>
                ))}
              </div>
              <Box sx={{ mt: 2 }}>
                <Button type="submit" variant="contained" color="primary">
                  Actualizar
                </Button>
                <Button
                  sx={{ marginLeft: 1 }}
                  variant="contained"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Modal>
      <Modal
        open={openAddModal}
        onClose={() => {
          handleCloseAddModal();
          handleCancelAddUser();
        }}
        aria-labelledby="add-modal-title"
        aria-describedby="add-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" id="add-modal-title">
            Agregar Nuevo Usuario
          </Typography>
          <form onSubmit={handleSubmit(handleAddUserSubmit)}>
            <div>
              {fieldsConfig.map((fieldsConfig, index) => (
                <div key={index}>
                  <Controller
                    name={fieldsConfig.name}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id={`${fieldsConfig.name}-input`}
                        label={fieldsConfig.label}
                        variant="outlined"
                        sx={{ m: 2 }}
                        size="small"
                        error={
                          formState.errors?.[fieldsConfig.name] ? true : false
                        }
                        helperText={
                          (formState.errors?.[fieldsConfig.name]
                            ?.message as string) ?? ""
                        }
                      />
                    )}
                  />
                </div>
              ))}
            </div>
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Agregar
              </Button>
              <Button
                sx={{ marginLeft: 1 }}
                variant="contained"
                onClick={handleCancelAddUser}
              >
                Cancelar
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
       <Modal
        open={openAddressModel}
        onClose={() => setOpenAddressModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" id="modal-title">
            Direcciones del usuario {selectedUserId}
          </Typography>
          <div>
            {userAddresses.map((address, index) => (
              <div key={index}>
                <Typography variant="body1" component="p">
                  {address.direccion}, {address.ciudad}, {address.pais}, {address.codigoPostal}
                </Typography>
              </div>
            ))}
          </div>
        </Box>
      </Modal>
    </>
  );
};
