import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";

interface User {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
}

interface Address {
  idDireccion: number;
  user: User;
  direccion: string;
  ciudad: string;
  pais: string;
  codigoPostal: string;
}

interface Product {
  idProducto: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

const paymentMethods = [
  { id: "card", label: "Credit Card" },
  { id: "paypal", label: "PayPal" },
  { id: "bank", label: "Bank Transfer" },
];

const CheckoutView: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [storedCart, setStoredCart] = useState<Product[]>([]);
  const [showProducts, setShowProducts] = useState<boolean>(false);

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch(
          `https://motographixapi.up.railway.app/direccionesuser/${userId}`
        );
        const data = await response.json();
        setAddresses(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setLoading(false);
      }
    };

    const fetchCart = () => {
      const storedCartJSON = sessionStorage.getItem("cart");
      if (storedCartJSON) {
        setStoredCart(JSON.parse(storedCartJSON));
      }
    };

    fetchAddresses();
    fetchCart();
  }, [userId]);

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAddress(parseInt(event.target.value, 10));
  };

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleConfirm = async () => {
    if (!selectedAddress || !selectedPaymentMethod) {
      // Si no se ha seleccionado dirección o método de pago, no hacer nada
      return;
    }

    try {
      // Crear el objeto de pedido
      const orderData = {
        idUsuario: parseInt(userId || "0", 10),
        estado: "pendiente",
        total_pedido: total,
        direccionEnvio: addresses.find(
          (address) => address.idDireccion === selectedAddress
        )?.direccion || "",
        formaPago: selectedPaymentMethod,
        fechaEntrega: ""
      };

      // Enviar la solicitud POST para crear el pedido
      const response = await fetch("https://motographixapi.up.railway.app/savepedido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        console.log("Pedido creado correctamente.");

        // Obtener el ID del pedido recién creado
        const order = await response.json();
        const orderId = order.idPedido;

        // Crear un detalle de pedido para cada producto en la cesta
        for (const product of storedCart) {
          const detailData = {
            idPedido: orderId,
            idProducto: product.idProducto,
            cantidad: product.cantidad
          };

          // Enviar la solicitud POST para crear el detalle del pedido
          const detailResponse = await fetch("https://motographixapi.up.railway.app/savedetallepedido", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(detailData)
          });

          if (detailResponse.ok) {
            console.log(`Detalle de pedido para el producto ${product.idProducto} creado correctamente.`, detailData);
          } else {
            console.error(`Error al crear el detalle de pedido para el producto ${product.idProducto}:`, detailResponse.statusText);
          }
        }

        // Marcar que se ha creado un pedido en esta sesión
        sessionStorage.setItem("orderCreated", "true");

        // Vaciar la cesta
        sessionStorage.removeItem("cart");

        // Redirigir al usuario a la página de inicio
        window.location.href = "/home";
      } else {
        console.error("Error al crear el pedido:", response.statusText);
      }
    } catch (error) {
      console.error("Error al crear el pedido:", error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const goBack = () => {
    window.history.back();
  };

  const total = storedCart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Elige una Dirección
      </Typography>
      <RadioGroup
        value={selectedAddress?.toString()}
        onChange={handleAddressChange}
      >
        {addresses.map((address) => (
          <FormControlLabel
            key={address.idDireccion}
            value={address.idDireccion.toString()}
            control={<Radio />}
            label={`${address.direccion}, ${address.ciudad}, ${address.pais}, ${address.codigoPostal}`}
          />
        ))}
      </RadioGroup>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>
        Elige un Método de Pago
      </Typography>
      <FormControl component="fieldset">
        <FormLabel component="legend">Método de Pago</FormLabel>
        <RadioGroup
          value={selectedPaymentMethod}
          onChange={handlePaymentMethodChange}
        >
          {paymentMethods.map((method) => (
            <FormControlLabel
              key={method.id}
              value={method.id}
              control={<Radio />}
              label={method.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Button
        variant="contained"
        onClick={handleConfirm}
        disabled={!selectedAddress || !selectedPaymentMethod}
        sx={{ mt: 2 }}
      >
        Confirmar
      </Button>
      {showProducts && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Productos en la Cesta
          </Typography>
          {storedCart.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{item.nombre}</Typography>
              <Typography variant="body1">
                Precio/Ud: {item.precio.toFixed(2)}€ | Cantidad: {item.cantidad}{" "}
                | Subtotal: {(item.cantidad * item.precio).toFixed(2)}€
              </Typography>
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}
          {storedCart.length === 0 && (
            <Typography variant="body1">
              No hay productos en la cesta.
            </Typography>
          )}
          {storedCart.length > 0 && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total: {total.toFixed(2)}€
            </Typography>
          )}
           <Button variant="contained" sx={{ mt: 2 }}>
          Confirmar Pedido
        </Button>
        </>
      )}

      <br />
      <Link to="/home">
        <Button variant="contained" sx={{ mt: 2 }}>
          Volver
        </Button>
      </Link>
    </Box>
  );
};

export default CheckoutView;

