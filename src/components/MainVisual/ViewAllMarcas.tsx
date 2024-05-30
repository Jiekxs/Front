import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import { TextField, Paper, IconButton, Alert } from '@mui/material';
import { Controller, useForm } from "react-hook-form";
import { vestResolver } from "@hookform/resolvers/vest";
import { FormValidation } from "../../auth/pages/Validations/MarcaValidate";


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

export const ViewAllMarcas = () => {
  const [marcas, setMarcas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [marcaIdToDelete, setMarcaIdToDelete] = useState<number | null>(null);
  const [deletedMarcaName, setDeletedMarcaName] = useState<string>("");
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedMarcaId, setSelectedMarcaId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({ nombre: "", descripcion: "" });
  const { control, handleSubmit, reset, formState } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: vestResolver(FormValidation),
  });

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


  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await fetch("https://motographixapi.up.railway.app/marcas");
        if (!response.ok) {
          showAlert('error', 'Error al obtener las marcas');

          throw new Error("Error al obtener las marcas");
        }
        const data = await response.json();
        setMarcas(data);
        setLoading(false);
      } catch (error) {
        showAlert('error', 'Error al obtener las marcas');
        setLoading(false);
      }
    };

    fetchMarcas();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    setMarcaIdToDelete(id);
    setDeletedMarcaName(name);
    setOpenModal(true);
  };

  const handleEdit = (marcaId: number) => {
    setSelectedMarcaId(marcaId);
    const selectedMarca = marcas.find((marca) => marca.idMarca === marcaId);
    if (selectedMarca) {
      setFormData(selectedMarca);
    }
    setOpenEditModal(true);
  };

  const handleAdd = () => {
    setFormData({ nombre: "", descripcion: "" });
    setOpenAddModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`https://motographixapi.up.railway.app/deletemarca/${marcaIdToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        showAlert('error', 'Error al borrar la marca');
        throw new Error("Error al eliminar la marca");
      }
      
      showAlert('success', 'Marca eliminada');

      const updatedMarcas = marcas.filter((marca) => marca.idMarca !== marcaIdToDelete);
      setMarcas(updatedMarcas);
    
    } catch (error) {
      showAlert('error', 'Error al borrar la marca');
    } finally {
      setOpenModal(false);
   
    }
  };

  const handleEditSubmit = async (formData: any) => {
    try {
      const response = await fetch(`https://motographixapi.up.railway.app/updatemarca/${selectedMarcaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        showAlert('error', 'Error al actualizar la marca');

        throw new Error("Error al actualizar la marca");
      }
      const updatedMarca = await response.json();
      const updatedMarcas = marcas.map((marca) => (marca.idMarca === selectedMarcaId ? updatedMarca : marca));
      setMarcas(updatedMarcas);
      showAlert('success', 'Marca actualizada');

      setOpenEditModal(false);
      reset(); 
    } catch (error) {
      showAlert('error', 'Error al actualizar la marca');
    }
  };

  const handleAddSubmit = async (formData: any) => {
    try {
      const response = await fetch("https://motographixapi.up.railway.app/savemarca", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        showAlert('error', 'Error al agregar la marca');

        throw new Error("Error al agregar la marca");
      }
      const newMarca = await response.json();
      setMarcas([...marcas, newMarca]);
      showAlert('success', 'Marca agregada');

      setOpenAddModal(false);
      reset(); 
     
    } catch (error) {
      showAlert('error', 'Error al agregar la marca');
    }
  };

  const fieldsConfig = [
    { name: "nombreMarca", label: "Nombre" },
    { name: "descripcionMarca", label: "Descripcion" },
  ];

  const columns: GridColDef[] = [
    { field: "nombreMarca", headerName: "Nombre", flex:0.3 },
    { field: "descripcionMarca", headerName: "Descripción",flex:2 },
    {
      field: "editar",
      headerName: "Editar",flex:0.15,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton onClick={() => handleEdit(params.row.idMarca)}>
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "borrar",
      headerName: "Eliminar",flex:0.15,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton onClick={() => handleDelete(params.row.idMarca, params.row.nombre)}>
          <DeleteIcon />
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
      <h2>Marcas</h2>
      <Button variant="contained" color="primary" onClick={handleAdd}>
        Agregar Marca
      </Button>
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
            rows={marcas.map((marca, index) => ({ ...marca, id: index + 1 }))}
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
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" id="modal-title">
            Confirmar eliminación de marca
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            ¿Estás seguro de que deseas eliminar la marca <b>{deletedMarcaName}</b>?
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
          setOpenEditModal(false);
          reset(); // Resetea el formulario al salir de la ventana modal
        }}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" id="edit-modal-title">
            Editar Marca
          </Typography>
          {selectedMarcaId !== null && (
            <form onSubmit={handleSubmit(handleEditSubmit)}>
              <div>
                {fieldsConfig.map((fieldsConfig, index) => (
                  <div key={index}>
                    <Controller
                      name={fieldsConfig.name}
                      control={control}
                      defaultValue={formData[fieldsConfig.name]}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id={`${fieldsConfig.name}-input`}
                          label={fieldsConfig.label}
                          variant="outlined"
                          sx={{ m: 2 }}
                          size="small"
                          error={!!formState.errors[field.name]}
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
                  onClick={() => {
                    setOpenEditModal(false);
                    reset(); 
                  }}
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
          setOpenAddModal(false);
          reset(); // Resetea el formulario al salir de la ventana modal
        }}
        aria-labelledby="add-modal-title"
        aria-describedby="add-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" id="add-modal-title">
            Agregar Nueva Marca
          </Typography>
          <form onSubmit={handleSubmit(handleAddSubmit)}>
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
                        error={!!formState.errors[field.name]}
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
                Agregar Marca
              </Button>
              <Button
                sx={{ marginLeft: 1 }}
                variant="contained"
                onClick={() => {
                  setOpenAddModal(false);
                  reset(); // Resetea el formulario al salir de la ventana modal
                }}
              >
                Cancelar
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};
