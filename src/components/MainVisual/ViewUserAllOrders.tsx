import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  Paper,
  Grid,
} from "@mui/material";

interface Pedido {
  idPedido: number;
  fechaPedido: string;
  estado: string;
  total_pedido: number;
  direccionEnvio: string;
  formaPago: string;
  fechaEntrega: string;
}

interface DetallePedido {
  idDetalle: number;
  producto: {
    nombre: string;
    precio: number;
  };
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

const PedidosUsuario: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<DetallePedido[]>(
    []
  );

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const response = await fetch(
          `https://motographixapi.up.railway.app/pedidosusuario/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setPedidos(data);
        } else {
          throw new Error("Error al obtener los pedidos");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPedidos();
  }, []);

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

  return (
    <Paper sx={{ width: "95%", margin: "auto", padding: 5 }}>
      <Typography variant="h4" gutterBottom>
        Pedidos
      </Typography>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {pedidos.map((pedido) => (
          <Card key={pedido.idPedido}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ID del Pedido: {pedido.idPedido}
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
              <Button onClick={() => handlePedidoClick(pedido.idPedido)}>
                Ver Detalles
              </Button>
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
                    <div>
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
                      <hr />
                    </div>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Paper>
      </Modal>
    </Paper>
  );
};

export default PedidosUsuario;
