import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Modal,
  Rating,
  TextField,
  Typography,
} from "@mui/material";

interface EditedReview {
  calificacion: number;
  comentario: string;
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface ProductCardProps {
  product: {
    idProducto: number;
    nombre: string;
    descripcion: string;
    precio: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product}) => {
  const [resenas, setResenas] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editedReview, setEditedReview] = useState<EditedReview>({
    calificacion: 0,
    comentario: "",
  });

  useEffect(() => {
    fetchResenas();
  }, [product.idProducto]);

  const fetchResenas = async () => {
    try {
      const response = await fetch(
        `https://motographixapi.up.railway.app/resenaproducto/${product.idProducto}`
      );
      if (response.ok) {
        const data = await response.json();
        setResenas(data);
      }
    } catch (error) {}
  };

  const totalResenas = resenas.length;
  const sumaCalificaciones = resenas.reduce(
    (acumulador, resena) => acumulador + resena.calificacion,
    0
  );
  const calificacionPromedio =
    totalResenas > 0 ? sumaCalificaciones / totalResenas : 0;

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleAddReview = async () => {
    try {
      const response = await fetch("https://motographixapi.up.railway.app/saveresena", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idUsuario: sessionStorage.getItem("userId"),
          idProducto: product.idProducto,
          calificacion: editedReview.calificacion,
          comentario: editedReview.comentario,
        }),
      });
      if (response.ok) {
        fetchResenas();
        setEditedReview({
          calificacion: 0,
          comentario: "",
        });
        console.log("Reseña enviada correctamente");
      }
    } catch (error) {
      console.error("Error al enviar la reseña:", error);
    }
  };

  const handleAddToCart = () => {
    const storedCart = sessionStorage.getItem("cart");
    const currentCart = storedCart ? JSON.parse(storedCart) : [];
  
    const existingProductIndex = currentCart.findIndex((item: { idProducto: number; }) => item.idProducto === product.idProducto);
  
    if (existingProductIndex !== -1) {
      const updatedCart = [...currentCart];
      updatedCart[existingProductIndex].cantidad += 1;
      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
      console.log("Cantidad de producto actualizada en la cesta:", product);
    } else {
      const updatedCart = [...currentCart, { ...product, cantidad: 1 }];
      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
      console.log("Producto añadido a la cesta:", product);
    }

  };
  

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} style={{ marginBottom: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Card sx={{ minHeight: 250, flexGrow: 1 }}>
          <CardContent style={{ overflow: "hidden" }}>
            <Typography>
              <img
                src="/dist/img/KTM-Logo.png"
                alt=""
                style={{ width: 250, cursor: "pointer" }}
                onClick={handleModalOpen}
              />
            </Typography>
            <Rating
              name="read-only"
              value={calificacionPromedio}
              precision={0.5}
              readOnly
            />
            <Typography variant="h6" component="div">
              {product.nombre}
            </Typography>
            <Typography variant="body2">{product.descripcion}</Typography>
            <Typography variant="body2">{product.precio}€</Typography>
            <Button onClick={handleAddToCart}>Añadir</Button>{" "}
          </CardContent>
          <style>
            {`
              ::-webkit-scrollbar {
                width: 8px;
                background-color: transparent;
              }

              ::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0);
                border-radius: 4px;
              }

              ::-webkit-scrollbar-track {
                background-color: transparent;
              }
            `}
          </style>
        </Card>
      </div>
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5">{product.nombre}</Typography>
          <Typography>{product.descripcion}</Typography>
          <Typography>{product.precio}€</Typography>
          <Typography>Calificación Promedio</Typography>
          <Rating
            name="read-only"
            value={calificacionPromedio}
            readOnly
            size="medium"
            precision={0.5}
          />

          <Typography>{totalResenas} reseñas totales</Typography>

          <Typography variant="h6">Escribe tu reseña:</Typography>
          <Rating
            name="calificacion"
            value={editedReview.calificacion}
            onChange={(event, newValue) => {
              setEditedReview((prevReview: EditedReview) => ({
                ...prevReview,
                calificacion: newValue || 0,
              }));
            }}
            size="medium"
          />
          <TextField
            label="Comentario"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={editedReview.comentario}
            onChange={(e) =>
              setEditedReview((prevReview: EditedReview) => ({
                ...prevReview,
                comentario: e.target.value,
              }))
            }
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddReview}
            style={{ marginTop: 10 }}
          >
            Enviar Reseña
          </Button>

          <Box sx={{ maxHeight: 200, overflow: "auto", overflowX: "hidden" }}>
            {resenas.map((resena, index) => (
              <Box
                key={index}
                sx={{
                  height: "0",
                }}
              >
                <Rating
                  name="read-only"
                  value={resena.calificacion}
                  readOnly
                  size="medium"
                  color="red"
                />
                <Typography>
                  <b>
                    {resena.usuario.nombre}{" "}
                    {new Date(resena.fechaResena)
                      .toISOString()
                      .replace("T", "  ")
                      .slice(0, -5)}
                  </b>
                </Typography>
                <Typography>Comentario: {resena.comentario}</Typography>
                <hr />
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
};

export default ProductCard;
