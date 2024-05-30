import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import {
  TextField,
  Select,
  MenuItem,
  Box,
  Paper,
  IconButton,
  Alert,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FormValidation } from "../../auth/pages/Validations/EditProductoValidate";
import { vestResolver } from "@hookform/resolvers/vest";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
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

const ViewAllProducts = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [productoIdToDelete, setProductoIdToDelete] = useState<number | null>(
    null
  );
  const [deletedProductName, setDeletedProductName] = useState<string>("");
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [modelos, setModelos] = useState<any[]>([]);

  const [formData, setFormData] = useState<any>({
    nombre: "",
    descripcion: "",
    precio: "",
    idModelo: null,
    stock: "",
  });
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
    const fetchProductos = async () => {
      try {
        const response = await fetch(
          "https://motographixapi.up.railway.app/productos"
        );
        if (!response.ok) {
          showAlert('error', 'Error al obtener los productos');

          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        setProductos(data);
        setLoading(false);

      } catch (error) {
        showAlert('error', 'Error al obtener los productos');
        setLoading(false);
      }
    };

    const fetchModelos = async () => {
      try {
        const response = await fetch(
          "https://motographixapi.up.railway.app/modelos"
        );
        if (!response.ok) {
          showAlert('error', 'Error al obtener los modelos');

          throw new Error("Error al obtener los modelos");
        }
        const data = await response.json();
        setModelos(data); 
      } catch (error) {
        showAlert('error', 'Error al obtener los modelos');
      }
    };

    fetchProductos();
    fetchModelos();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    setProductoIdToDelete(id);
    setDeletedProductName(name);
    setOpenModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `https://motographixapi.up.railway.app/deleteproducto/${productoIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        showAlert('error', 'Error al eliminar el producto');

        throw new Error("Error al eliminar el producto");
      }
      const updatedProductos = productos.filter(
        (producto) => producto.idProducto !== productoIdToDelete
      );
      showAlert('success', 'Producto eliminado');

      setProductos(updatedProductos);
    } catch (error) {
      showAlert('error', 'Error al eliminar el producto');
    } finally {
      setOpenModal(false);
    }
  };

  const handleEdit = (productoId: number) => {
    setSelectedProductId(productoId);
    const selectedProducto = productos.find(
      (producto) => producto.idProducto === productoId
    );
    if (selectedProducto) {
      const idModelo = selectedProducto.modelo
        ? selectedProducto.modelo.idModelo
        : null;
      setFormData({
        nombre: selectedProducto.nombre,
        descripcion: selectedProducto.descripcion,
        precio: selectedProducto.precio.toString(),
        idModelo: idModelo,
        stock: selectedProducto.stock.toString(),
      });
    }
    setOpenEditModal(true);
  };

  const handleAdd = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      idModelo: null,
      stock: "",
    });
    setOpenAddModal(true);
  };

  const handleEditSubmit = async (formData: any) => {
    try {
      if (!selectedProductId) {
        return;
      }

      // Verificar si formData contiene datos válidos
      const { nombre, descripcion, precio, idModelo, stock } = formData;
      if (!nombre || !descripcion || !precio || !idModelo || !stock) {
        console.error("Los datos del formulario son inválidos.");
        return;
      }

      const updatedProductoData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        modelo: {
          idModelo: formData.idModelo,
        },
        stock: parseInt(formData.stock),
      };

      const response = await fetch(
        `https://motographixapi.up.railway.app/updateproducto/${selectedProductId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProductoData),
        }
      );
      if (!response.ok) {
        showAlert('error', 'Error al actualizar el producto');

        throw new Error("Error al actualizar el producto");
      }
      const updatedProducto = await response.json();
      const updatedProductos = productos.map((producto) =>
        producto.idProducto === selectedProductId ? updatedProducto : producto
      );
      setProductos(updatedProductos);
      showAlert('success', 'Producto actualizado');

      // Resetear el formulario y cerrar el modal de edición
      setOpenEditModal(false);
      reset();
    } catch (error) {
      showAlert('error', 'Error al actualizar el producto');
    }
  };

  const handleAddSubmit = async (formData: any) => {
    try {
      const selectedModelo = modelos.find(
        (modelo) => modelo.idModelo === formData.idModelo
      );
      if (!selectedModelo) {
        console.error("Modelo no encontrado para el ID proporcionado.");
        return;
      }

      const newProductoData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        modelo: selectedModelo, // Utilizar la estructura completa del modelo
        stock: parseInt(formData.stock),
      };

      const response = await fetch(
        "https://motographixapi.up.railway.app/saveproducto",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProductoData),
        }
      );

      if (!response.ok) {
        showAlert('error', 'Error al agregar el producto');

        throw new Error("Error al agregar el producto");
      }

      const newProducto = await response.json();
      setProductos([...productos, newProducto]);
      setOpenAddModal(false);
      showAlert('success', 'Producto agregado');
      reset();
    } catch (error) {
      showAlert('error', 'Error al agregar el producto');
    }
  };

  const fieldsConfig = [
    { name: "nombre", label: "Nombre" },
    { name: "descripcion", label: "Descripción" },
    { name: "precio", label: "Precio" },
    { name: "idModelo", label: "Modelo" },
    { name: "stock", label: "Stock" },
  ];

  const columns: GridColDef[] = [
    {
      field: "modelo.marca.nombreMarca",
      headerName: "Marca",
      width: 150,
      renderCell: (params: GridRenderCellParams) =>
        params.row.modelo.marca.nombreMarca,
    },
    {
      field: "modelo.nombre",
      headerName: "modelo",
      width: 150,
      renderCell: (params: GridRenderCellParams) => params.row.modelo.nombre,
    },
    { field: "nombre", headerName: "Producto", flex:1 },
    { field: "descripcion", headerName: "Descripción", flex:1},
    { field: "precio", headerName: "Precio", flex:0.5 },
    { field: "stock", headerName: "Stock", flex:0.5 },
    {
      field: "editar",
      headerName: "Editar",
      flex:0.3,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton onClick={() => handleEdit(params.row.idProducto)}>
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "borrar",
      headerName: "Eliminar",
      flex:0.3,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          onClick={() => handleDelete(params.row.idProducto, params.row.nombre)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Paper sx={{ width: "70%", margin: "auto", padding: 5 }}>
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
        {alertData.open && (
          <Alert severity={alertData.severity} onClose={handleCloseAlert}>
            {alertData.message}
          </Alert>
        )}
      </div>
        <h2>Productos</h2>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Agregar Producto
        </Button>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </div>
        ) : (
          <div style={{ height: "auto", width: "100%" }}>
            <DataGrid
              rows={productos.map((producto, index) => ({
                ...producto,
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
              pageSizeOptions={[10, 20, 30]}
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
            Confirmar eliminación de producto
          </Typography>
          <Typography id="modal-description" style={{ marginTop: 8 }}>
            ¿Estás seguro de que deseas eliminar el producto{" "}
            <b>{deletedProductName}</b>?
          </Typography>
          <div style={{ marginTop: 16 }}>
            <Button variant="contained" color="error" onClick={confirmDelete}>
              Confirmar
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              variant="contained"
              onClick={() => setOpenModal(false)}
            >
              Cancelar
            </Button>
          </div>
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
            Editar Producto
          </Typography>
          {selectedProductId !== null && (
            <form onSubmit={handleSubmit(handleEditSubmit)}>
              <div>
                {fieldsConfig.map((fieldsConfig, index) => (
                  <div key={index}>
                    <Controller
                      name={fieldsConfig.name}
                      control={control}
                      defaultValue={formData[fieldsConfig.name]}
                      render={({ field }) =>
                        fieldsConfig.name === "idModelo" ? (
                          <Select
                            {...field}
                            variant="outlined"
                            style={{ margin: 8 }}
                            error={!!formState.errors[field.name]}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            {modelos.map((modelo: any) => (
                              <MenuItem
                                key={modelo.idModelo}
                                value={modelo.idModelo}
                              >
                                {modelo.nombre}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          <TextField
                            {...field}
                            label={fieldsConfig.label}
                            variant="outlined"
                            style={{ margin: 8 }}
                            error={!!formState.errors[field.name]}
                            helperText={
                              (formState.errors?.[fieldsConfig.name]
                                ?.message as string) ?? ""
                            }
                          />
                        )
                      }
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <Button type="submit" variant="contained" color="primary">
                  Actualizar
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  variant="contained"
                  onClick={() => {
                    setOpenEditModal(false);
                    reset();
                  }}
                >
                  Cancelar
                </Button>
              </div>
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
            Agregar Nuevo Producto
          </Typography>
          <form onSubmit={handleSubmit(handleAddSubmit)}>
            <div>
              {fieldsConfig.map((fieldsConfig, index) => (
                <div key={index}>
                  <Controller
                    name={fieldsConfig.name}
                    control={control}
                    defaultValue=""
                    render={({ field }) =>
                      fieldsConfig.name === "idModelo" ? (
                        <div>
                          <Select
                            {...field}
                            variant="outlined"
                            style={{ margin: 8 }}
                            error={!!formState.errors[field.name]}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            {modelos.map((modelo: any) => (
                              <MenuItem
                                key={modelo.idModelo}
                                value={modelo.idModelo}
                              >
                                {modelo.nombre}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                      ) : (
                        <TextField
                          {...field}
                          label={fieldsConfig.label}
                          variant="outlined"
                          style={{ margin: 8 }}
                          error={!!formState.errors[field.name]}
                          helperText={
                            (formState.errors?.[fieldsConfig.name]
                              ?.message as string) ?? ""
                          }
                        />
                      )
                    }
                  />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <Button type="submit" variant="contained" color="primary">
                Agregar Producto
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                variant="contained"
                onClick={() => {
                  setOpenAddModal(false);
                  reset();
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default ViewAllProducts;
