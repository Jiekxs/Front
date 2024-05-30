import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PDFDownloadLink } from "@react-pdf/renderer";
import dayjs, { Dayjs } from "dayjs";
import PedidosPDF from "../pdf/PedidoPdf";
import { SelectChangeEvent } from "@mui/material/Select";
import CustomAlert from "../alert/alertView";

export interface Pedido {
  idPedido: number;
  idUsuario: string;
  fechaPedido: string;
  estado: string;
  total_pedido: number;
  direccionEnvio: string;
  formaPago: string;
  fechaEntrega: string;
}

export interface DetallePedido {
  idDetalle: number;
  producto: {
    nombre: string;
    precio: number;
  };
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Usuario {
  idUsuario: string;
  nombre: string;
  email: string;
  telefono:string;
}
export type AlertSeverity = "error" | "warning" | "info" | "success";

export interface CustomAlertProps {
  severity: AlertSeverity;
  message: string;
  onClose: () => void;
}

const Pedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState<Pedido[]>([]);
  const [pedidoEditando, setPedidoEditando] = useState<Pedido | null>(null);
  const [nuevoEstadoPedido, setNuevoEstadoPedido] = useState<string>("");
  const [usuarios, setUsuarios] = useState<Record<string, Usuario>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<DetallePedido[]>([]);
  const [fechaInicio, setFechaInicio] = useState<Dayjs | null>(null);
  const [fechaFin, setFechaFin] = useState<Dayjs | null>(null);
  const [estadoFiltro, setEstadoFiltro] = useState<string>("");

  const [showAlert, setShowAlert] = useState(false); // Estado para controlar la visibilidad del alert
  const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>("success"); // Estado para la severidad del alert
  const [alertMessage, setAlertMessage] = useState(""); //

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch(
          `https://motographixapi.up.railway.app/pedidos`
        );
        if (response.ok) {
          const data = await response.json();
          setPedidos(data);
          setPedidosFiltrados(data);
        } else {
          throw new Error("Error al obtener los pedidos");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPedidos();
  }, []);

  const refetchPedidos = async () => {
    try {
      const response = await fetch(
        `https://motographixapi.up.railway.app/pedidos`
      );
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
        setPedidosFiltrados(data); // También actualiza los pedidos filtrados si es necesario
      } else {
        throw new Error("Error al obtener los pedidos");
      }
    } catch (error) {
      console.error(error);
    }
  };
  


  useEffect(() => {
    const fetchUsuario = async (idUsuario: string) => {
      try {
        const response = await fetch(
          `https://motographixapi.up.railway.app/finduserid/${idUsuario}`
        );
        if (response.ok) {
          const data = await response.json();
          setUsuarios((prevUsuarios) => ({
            ...prevUsuarios,
            [idUsuario]: data,
          }));
        } else {
          throw new Error("Error al obtener los detalles del usuario");
        }
      } catch (error) {
        console.error(error);
      }
    };

    pedidos.forEach((pedido) => {
      if (!usuarios[pedido.idUsuario]) {
        fetchUsuario(pedido.idUsuario);
      }
    });
  }, [pedidos, usuarios]);

  const handlePedidoClick = async (idPedido: number) => {
    try {
      const response = await fetch(
        `https://motographixapi.up.railway.app/detallespedido/${idPedido}`
      );
      if (response.ok) {
        const data = await response.json();
        setPedidoSeleccionado(data);
        setModalOpen(true);
      } else {
        throw new Error("Error al obtener los detalles del pedido");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filtrarPedidosPorFecha = () => {
    if (fechaInicio && fechaFin) {
      const pedidosFiltrados = pedidos.filter((pedido) => {
        const fechaPedido = dayjs(pedido.fechaPedido);
        return (
          (fechaPedido.isAfter(fechaInicio, "day") ||
            fechaPedido.isSame(fechaInicio, "day")) &&
          (fechaPedido.isBefore(fechaFin, "day") ||
            fechaPedido.isSame(fechaFin, "day"))
        );
      });
      setPedidosFiltrados(pedidosFiltrados);
    } else {
      setPedidosFiltrados(pedidos);
    }
  };

  useEffect(() => {
    filtrarPedidosPorFecha();
  }, [fechaInicio, fechaFin]);

  const limpiarFiltro = () => {
    setFechaInicio(null);
    setFechaFin(null);
    setEstadoFiltro("");
    setPedidosFiltrados(pedidos);
  };

  const generarNombrePDF = (
    fechaInicio: Dayjs | null,
    fechaFin: Dayjs | null
  ) => {
    let nombre = "pedidos";
    if (fechaInicio && fechaFin) {
      const formatoInicio = fechaInicio.format("YYYY-MM-DD");
      const formatoFin = fechaFin.format("YYYY-MM-DD");
      nombre = `pedidos_${formatoInicio}_${formatoFin}.pdf`;
    }
    return nombre;
  };

  const userRole = sessionStorage.getItem("userRole");
  const showButton = userRole === "admin" || userRole === "mecanico";

  const handleChangeEstadoFiltro = (event: SelectChangeEvent<string>) => {
    setEstadoFiltro(event.target.value);
  };

  const pedidosFiltradosPorEstado = estadoFiltro ? pedidosFiltrados.filter(pedido => pedido.estado === estadoFiltro) : pedidosFiltrados;

  const handleEditarClick = (pedido: Pedido) => {
    setPedidoEditando(pedido);
    setNuevoEstadoPedido(pedido.estado);
  };

  const handleGuardarCambios = async () => {
    try {
      if (!pedidoEditando) return; // Asegúrate de tener un pedido para editar
  
      const response = await fetch(
        `https://motographixapi.up.railway.app/updatepedido/${pedidoEditando.idPedido}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...pedidoEditando, // Mantén todos los campos del pedido
            estado: nuevoEstadoPedido, // Actualiza solo el estado
          }),
        }
      );
  
      if (response.ok) {
        // Actualiza los pedidos solo si la solicitud fue exitosa
        const updatedPedidos = pedidos.map((pedido) =>
          pedido.idPedido === pedidoEditando.idPedido
            ? { ...pedido, estado: nuevoEstadoPedido } // Actualiza el estado del pedido editado
            : pedido
        );
        setPedidos(updatedPedidos);
        // Cierra el diálogo de edición
        setPedidoEditando(null);
        setShowAlert(true);
        setAlertSeverity("success");
        setAlertMessage("Estado modificado correctamente");
        refetchPedidos();
      } else {
        setShowAlert(true);
        setAlertSeverity("error");
        setAlertMessage("Error al actualizar el pedido");
        throw new Error("Error al actualizar el pedido");
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <Paper sx={{ width: "90%", margin: "auto", padding: 5 }}>
       {showAlert && (
        <CustomAlert severity={alertSeverity} message={alertMessage} />
      )}
      <Typography variant="h4" gutterBottom>
        Pedidos
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <DesktopDatePicker
            label="Fecha Inicio"
            value={fechaInicio}
            onChange={(date) => setFechaInicio(date)}
          />
          <DesktopDatePicker
            label="Fecha Fin"
            value={fechaFin}
            onChange={(date) => setFechaFin(date)}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="estado-filtro-label">Estado</InputLabel>
            <Select
              labelId="estado-filtro-label"
              id="estado-filtro"
              value={estadoFiltro}
              onChange={handleChangeEstadoFiltro}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="pendiente">Pendiente</MenuItem>
              <MenuItem value="procesando">Procesando</MenuItem>
              <MenuItem value="enviado">Enviado</MenuItem>
              <MenuItem value="finalizado">Finalizado</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={limpiarFiltro}>
            Limpiar filtro
          </Button>
          <PDFDownloadLink
            document={
              <PedidosPDF pedidos={pedidosFiltradosPorEstado} usuarios={usuarios} />
            }
            fileName={generarNombrePDF(fechaInicio, fechaFin)}
          >
            <Button variant="contained">Exportar a PDF</Button>
          </PDFDownloadLink>
        </div>
      </LocalizationProvider>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {pedidosFiltradosPorEstado.map((pedido) => (
          <Card key={pedido.idPedido}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ID del Pedido: {pedido.idPedido}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Cliente:{" "}
                {usuarios[pedido.idUsuario]
                  ? `${usuarios[pedido.idUsuario].nombre} (${
                      usuarios[pedido.idUsuario].email
                    })`
                  : "Cargando..."}
              </Typography>

              <Typography color="textSecondary" gutterBottom>
                Fecha del Pedido:{" "}
                {new Date(pedido.fechaPedido).toLocaleString()}
              </Typography>
              <Typography color="Highlight" gutterBottom>
                Estado: {pedido.estado}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Total del Pedido: ${pedido.total_pedido}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Dirección de Envío: {pedido.direccionEnvio}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Forma de Pago: {pedido.formaPago}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Fecha de Entrega:{" "}
                {new Date(pedido.fechaEntrega).toLocaleDateString()}
              </Typography>
              <Grid container spacing={10}>
                <Grid item>
                  <Button onClick={() => handlePedidoClick(pedido.idPedido)}>
                    Ver Detalles
                  </Button>
                </Grid>
                {showButton && (
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditarClick(pedido)}
                    >
                      Editar
                    </Button>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        ))}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Paper
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
          }}
        >
          {pedidoSeleccionado.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Detalles del Pedido
              </Typography>
              <Grid container spacing={2}>
                {pedidoSeleccionado.map((detalle) => (
                  <Grid
                    item
                    xs={pedidoSeleccionado.length === 1 ? 12 : 4}
                    key={detalle.idDetalle}
                  >
                    <Paper sx={{ minHeight: 150, flexGrow: 1 }} >
                      <Typography variant="subtitle1">
                        Producto: {detalle.producto.nombre}
                      </Typography>
                      <Typography variant="subtitle1">
                        Cantidad: {detalle.cantidad}
                      </Typography>
                      <Typography variant="subtitle1">
                        Precio Unitario: ${detalle.precioUnitario}
                      </Typography>
                      <Typography variant="subtitle1">
                        Subtotal: ${detalle.subtotal}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Paper>
      </Modal>
      <Modal open={Boolean(pedidoEditando)} onClose={() => setPedidoEditando(null)}>
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      padding: "20px",
      display: "flex",
      flexDirection: "column", // Cambia la dirección del flexbox a vertical
      gap: "20px", // Espacio entre elementos
    }}
  >
    <Typography variant="h6" gutterBottom>
      Editar Estado
    </Typography>
    <FormControl sx={{ minWidth: 120 }}>
      <InputLabel id="nuevo-estado-pedido-label">Nuevo Estado</InputLabel>
      <Select
        labelId="nuevo-estado-pedido-label"
        id="nuevo-estado-pedido"
        value={nuevoEstadoPedido}
        onChange={(event) => setNuevoEstadoPedido(event.target.value as string)}
      >
        <MenuItem value="pendiente">Pendiente</MenuItem>
        <MenuItem value="procesando">Procesando</MenuItem>
        <MenuItem value="enviado">Enviado</MenuItem>
        <MenuItem value="finalizado">Finalizado</MenuItem>
      </Select>
    </FormControl>
    <Button onClick={handleGuardarCambios} variant="contained" color="primary">
      Guardar Cambios
    </Button>
  </div>
</Modal>

    </Paper>
  );
};

export default Pedidos;


