import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Modal } from '@mui/material';

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
    precio: number,
  }
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

const Pedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<DetallePedido[]>([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch(`http://localhost:8080/pedidos`);
        if (response.ok) {
          const data = await response.json();
          setPedidos(data);
        } else {
          throw new Error('Error al obtener los pedidos');
        }
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchPedidos();
  }, []);

  const handlePedidoClick = async (idPedido: number) => {
    try {
      const response = await fetch(`http://localhost:8080/detallespedido/${idPedido}`);
      if (response.ok) {
        const data = await response.json();
        setPedidoSeleccionado(data);
        setModalOpen(true);
      } else {
        throw new Error('Error al obtener los detalles del pedido');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ margin: '0 auto', maxWidth: '1200px', padding: '0 20px' }}>
      <Typography variant="h4" gutterBottom>Pedidos del Usuario</Typography>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {pedidos.map(pedido => (
          <Card key={pedido.idPedido}>
            <CardContent>
              <Typography variant="h6" gutterBottom>ID del Pedido: {pedido.idPedido}</Typography>
              <Typography color="textSecondary" gutterBottom>Fecha del Pedido: {new Date(pedido.fechaPedido).toLocaleString()}</Typography>
              <Typography color="textSecondary" gutterBottom>Estado: {pedido.estado}</Typography>
              <Typography color="textSecondary" gutterBottom>Total del Pedido: ${pedido.total_pedido}</Typography>
              <Typography color="textSecondary" gutterBottom>Dirección de Envío: {pedido.direccionEnvio}</Typography>
              <Typography color="textSecondary" gutterBottom>Forma de Pago: {pedido.formaPago}</Typography>
              <Typography color="textSecondary" gutterBottom>Fecha de Entrega: {new Date(pedido.fechaEntrega).toLocaleDateString()}</Typography>
              <Button onClick={() => handlePedidoClick(pedido.idPedido)}>Ver Detalles</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
          {pedidoSeleccionado.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>Detalles del Pedido</Typography>
              {pedidoSeleccionado.map(detalle => (
                <div key={detalle.idDetalle}>
                  <Typography variant="subtitle1">Producto: {detalle.producto.nombre}</Typography>
                  <Typography variant="subtitle1">Cantidad: {detalle.cantidad}</Typography>
                  <Typography variant="subtitle1">Precio Unitario: ${detalle.precioUnitario}</Typography>
                  <Typography variant="subtitle1">Subtotal: ${detalle.subtotal}</Typography>
                  <hr />
                </div>
              ))}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Pedidos;