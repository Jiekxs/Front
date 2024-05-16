import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import { TextField } from "@mui/material";
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

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await fetch("http://localhost:8080/marcas");
        if (!response.ok) {
          throw new Error("Error al obtener las marcas");
        }
        const data = await response.json();
        setMarcas(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las marcas:", error);
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
      const response = await fetch(`http://localhost:8080/deletemarca/${marcaIdToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la marca");
      }
      const updatedMarcas = marcas.filter((marca) => marca.idMarca !== marcaIdToDelete);
      setMarcas(updatedMarcas);
    } catch (error) {
      console.error("Error al eliminar la marca:", error);
    } finally {
      setOpenModal(false);
    }
  };

  const handleEditSubmit = async (formData: any) => {
    try {
      const response = await fetch(`http://localhost:8080/updatemarca/${selectedMarcaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar la marca");
      }
      const updatedMarca = await response.json();
      const updatedMarcas = marcas.map((marca) => (marca.idMarca === selectedMarcaId ? updatedMarca : marca));
      setMarcas(updatedMarcas);
      setOpenEditModal(false);
      reset(); // Resetea el formulario después de la actualización exitosa
    } catch (error) {
      console.error("Error al actualizar la marca:", error);
    }
  };

  const handleAddSubmit = async (formData: any) => {
    try {
      const response = await fetch("http://localhost:8080/savemarca", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Error al agregar la marca");
      }
      const newMarca = await response.json();
      setMarcas([...marcas, newMarca]);
      setOpenAddModal(false);
      reset(); // Resetea el formulario después de agregar una nueva marca exitosamente
    } catch (error) {
      console.error("Error al agregar la marca:", error);
    }
  };

  const fieldsConfig = [
    { name: "nombreMarca", label: "Nombre" },
    { name: "descripcionMarca", label: "Descripcion" },
  ];

  const columns: GridColDef[] = [
    { field: "nombreMarca", headerName: "Nombre", width: 130 },
    { field: "descripcionMarca", headerName: "Descripción", width: 500 },
    {
      field: "editar",
      headerName: "Editar",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <button onClick={() => handleEdit(params.row.idMarca)}>
          <EditIcon />
        </button>
      ),
    },
    {
      field: "borrar",
      headerName: "Eliminar",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <button onClick={() => handleDelete(params.row.idMarca, params.row.nombre)}>
          <DeleteIcon />
        </button>
      ),
    },
  ];

  return (
    <>
      <h2>Marcas</h2>
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
        <div style={{ height: 400, width: "100%" }}>
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
      <Button variant="contained" color="primary" onClick={handleAdd}>
        Agregar Marca
      </Button>
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
