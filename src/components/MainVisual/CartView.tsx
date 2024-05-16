import React from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import { Link } from "react-router-dom";

interface Product {
  idProducto: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

const CartView: React.FC = () => {
  const storedCartJSON = sessionStorage.getItem("cart");
  const storedCart: Product[] = storedCartJSON
    ? JSON.parse(storedCartJSON)
    : [];

  const goBack = () => {
    window.history.back();
  };

  // Calcular el total
  const total = storedCart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Productos en la Cesta
      </Typography>
      {storedCart.map((item, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Typography variant="subtitle1">{item.nombre}</Typography>
          <Typography variant="body1">
            Precio/Ud: {item.precio.toFixed(2)}€ | Cantidad: {item.cantidad} |
            Subtotal: {(item.cantidad * item.precio).toFixed(2)}€
          </Typography>
          <Divider sx={{ my: 1 }} />
        </Box>
      ))}
      {storedCart.length === 0 && (
        <Typography variant="body1">No hay productos en la cesta.</Typography>
      )}
      {storedCart.length > 0 && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          Total: {total.toFixed(2)}€
        </Typography>
      )}
      <Button variant="contained" onClick={goBack} sx={{ mt: 2 }}>
        Volver
      </Button>

      <br />
      <Link to="/home">
        <Button variant="contained" sx={{ mt: 2 }}>
          Home
        </Button>
      </Link>
    </Box>
  );
};

export default CartView;
