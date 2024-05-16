import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import { TextField, Select, MenuItem, InputLabel } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { vestResolver } from "@hookform/resolvers/vest";
import { FormValidation } from "../../auth/pages/Validations/ModeloValidate";

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

export const ViewAllModels = () => {
  const [modelos, setModelos] = React.useState<any[]>([]);
  const [marcas, setMarcas] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [modeloIdToDelete, setModeloIdToDelete] = React.useState<number | null>(
    null
  );
  const [deletedModeloName, setDeletedModeloName] = React.useState<string>("");
  const [openAddModal, setOpenAddModal] = React.useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = React.useState<boolean>(false);
  const [selectedModeloId, setSelectedModeloId] = React.useState<number | null>(
    null
  );
  const [formData, setFormData] = React.useState<any>({
    nombre: "",
    descripcion: "",
    marcaId: null,
  });
  const { control, handleSubmit, reset, formState } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: vestResolver(FormValidation),
  });

  React.useEffect(() => {
    const fetchModelos = async () => {
      try {
        const response = await fetch("https://motographixapi.up.railway.app/modelos");
        if (!response.ok) {
          throw new Error("Error al obtener los modelos");
        }
        const data = await response.json();
        setModelos(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los modelos:", error);
        setLoading(false);
      }
    };

    const fetchMarcas = async () => {
      try {
        const response = await fetch("https://motographixapi.up.railway.app/marcas");
        if (!response.ok) {
          throw new Error("Error al obtener las marcas");
        }
        const data = await response.json();
        setMarcas(data);
      } catch (error) {
        console.error("Error al obtener las marcas:", error);
      }
    };

    fetchModelos();
    fetchMarcas();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    setModeloIdToDelete(id);
    setDeletedModeloName(name);
    setOpenModal(true);
  };

  const handleEdit = (modeloId: number) => {
    setSelectedModeloId(modeloId);
    const selectedModelo = modelos.find(
      (modelo) => modelo.idModelo === modeloId
    );
    if (selectedModelo) {
      setFormData({
        nombre: selectedModelo.nombre,
        descripcion: selectedModelo.descripcion,
        marcaId: selectedModelo.idMarca,
      });
    }
    setOpenEditModal(true);
  };

  const handleAdd = () => {
    setFormData({ nombre: "", descripcion: "", marcaId: "" });
    setOpenAddModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `https://motographixapi.up.railway.app/deletemodelo/${modeloIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar el modelo");
      }
      const updatedModelos = modelos.filter(
        (modelo) => modelo.idModelo !== modeloIdToDelete
      );
      setModelos(updatedModelos);
    } catch (error) {
      console.error("Error al eliminar el modelo:", error);
    } finally {
      setOpenModal(false);
    }
  };

  const handleEditSubmit = async (formData: any) => {
    console.log(formData);
    try {
      const updatedModeloData = {
        marca: {
          idMarca: formData.marcaId,
        },
        nombre: formData.nombre,
        descripcion: formData.descripcion,
      };

      const response = await fetch(
        `https://motographixapi.up.railway.app/updatemodelo/${selectedModeloId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedModeloData),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar el modelo");
      }
      const updatedModelo = await response.json();
      const updatedModelos = modelos.map((modelo) =>
        modelo.idModelo === selectedModeloId ? updatedModelo : modelo
      );
      setModelos(updatedModelos);
      setOpenEditModal(false);
      reset();
    } catch (error) {
      console.error("Error al actualizar el modelo:", error);
    }
  };

  const handleAddSubmit = async (formData: any) => {
    try {
      const newModeloData = {
        marca: {
          idMarca: formData.marcaId,
        },
        nombre: formData.nombre,
        descripcion: formData.descripcion,
      };
  
      const response = await fetch("https://motographixapi.up.railway.app/savemodelo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newModeloData),
      });
  
      if (!response.ok) {
        throw new Error("Error al agregar el modelo");
      }
  
      const newModelo = await response.json();
      setModelos([...modelos, newModelo]);
      setOpenAddModal(false);
      reset();
    } catch (error) {
      console.error("Error al agregar el modelo:", error);
    }
  };
  

  const fieldsConfig = [
    { name: "nombre", label: "Nombre" },
    { name: "descripcion", label: "Descripción" },
    { name: "marcaId", label: "Id_Marca", select: true},
  ];

  const columns: GridColDef[] = [
    {
      field: "nombreMarca",
      headerName: "Marca",
      width: 150,
      renderCell: (params: GridRenderCellParams) =>
        params.row.marca.nombreMarca,    
    },
    {
      field: "descripcionMarca",
      headerName: "Descripcion",
      width: 150,
      renderCell: (params: GridRenderCellParams) =>
        params.row.marca.descripcionMarca,
    },
    { field: "nombre", headerName: "Modelo", width: 130 },
    { field: "descripcion", headerName: "Descripción", width: 300 },
    {
      field: "editar",
      headerName: "Editar",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <button onClick={() => handleEdit(params.row.idModelo)}>
          <EditIcon />
        </button>
      ),
    },
    {
      field: "borrar",
      headerName: "Eliminar",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <button
          onClick={() => handleDelete(params.row.idModelo, params.row.nombre)}
        >
          <DeleteIcon />
        </button>
      ),
    },
  ];

  return (
    <>
      <h2>Modelos</h2>
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
            rows={modelos.map((modelo, index) => ({
              ...modelo,
              id: index + 1,
            }))}
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
        Agregar Modelo
      </Button>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" id="modal-title">
            Confirmar eliminación de modelo
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            ¿Estás seguro de que deseas eliminar el modelo{" "}
            <b>{deletedModeloName}</b>?
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
          reset();
        }}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" id="edit-modal-title">
            Editar Modelo
          </Typography>
          {selectedModeloId !== null && (
            <form onSubmit={handleSubmit(handleEditSubmit)}>
              <div>
                {fieldsConfig.map((fieldsConfig, index) => (
                  <div key={index}>
                    {fieldsConfig.select ? (
                      <Controller
                        name={fieldsConfig.name}
                        control={control}
                        defaultValue={formData[fieldsConfig.name]}
                        render={({ field }) => (
                          <Select
                            {...field}
                            id={`${fieldsConfig.name}-select`}
                            variant="outlined"
                            sx={{ m: 2 }}
                            size="small"
                            error={!!formState.errors[field.name]}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            {marcas.map((marca: any) => (
                              <MenuItem
                                key={marca.idMarca}
                                value={marca.idMarca}
                              >
                                {marca.nombreMarca}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    ) : (
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
                    )}
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
          reset();
        }}
        aria-labelledby="add-modal-title"
        aria-describedby="add-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" id="add-modal-title">
            Agregar Nuevo Modelo
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
          disabled={fieldsConfig.name === 'marcaId'} // Deshabilita el campo Id_marca
          error={!!formState.errors[field.name]}
          helperText={
            (formState.errors?.[fieldsConfig.name]?.message as string) ?? ""
          }
        />
      )}
    />
  </div>
))}

              <div>
                <InputLabel id="marcaId-label">Selecciona una marca</InputLabel>
                <Controller
                  name="marcaId"
                  control={control}
                  defaultValue={formData.marcaId}
                  render={({ field }) => (
                    <div>
                      <Select
                        {...field}
                        id="marcaId-select"
                        variant="outlined"
                        sx={{ m: 2 }}
                        size="small"
                        labelId="marcaId-label"
                        error={!!formState.errors[field.name]}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        {marcas.map((marca: any) => (
                          <MenuItem key={marca.idMarca} value={marca.idMarca}>
                            {marca.nombreMarca}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  )}
                />
              </div>
            </div>
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Agregar Modelo
              </Button>
              <Button
                sx={{ marginLeft: 1 }}
                variant="contained"
                onClick={() => {
                  setOpenAddModal(false);
                  reset();
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
