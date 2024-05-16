import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import Rating from "@mui/material/Rating";

interface Review {
  idResena: number;
  comentario: string;
  calificacion: number;
  fechaResena:string;
  producto:{
        nombre:string;
  }
}

const UserReviews: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [editedReview, setEditedReview] = useState<Review>({
    idResena: 0,
    comentario: "",
    calificacion: 0,
    fechaResena:"string",
    producto:{
        nombre:"string"
  }
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedReviewToDelete, setSelectedReviewToDelete] =
    useState<Review | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(0); // Estado para la calificación del Rating

  const userId: number = parseInt(sessionStorage.getItem("userId") || "0");

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/resenauser/${userId}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener las reseñas del usuario");
        }
        const reviewsData = await response.json();
        setReviews(reviewsData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las reseñas del usuario:", error);
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [userId]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditModalOpen(false);
  };

  const handleAddReview = async () => {
    try {
      const response = await fetch("http://localhost:8080/saveresena", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editedReview,
          userId: userId,
        }),
      });
      if (!response.ok) {
        throw new Error("Error al agregar la reseña");
      }
      const newReview = await response.json();
      setReviews([...reviews, newReview]);
      setOpenModal(false);
    } catch (error) {
      console.error("Error al agregar la reseña:", error);
      setOpenModal(false);
    }
  };

  const handleEditReview = (review: Review) => {
    setSelectedReview(review);
    setEditedReview(review);
    setRatingValue(review.calificacion); // Establecer el valor del Rating al abrir la ventana modal
    setEditModalOpen(true);
  };

  const handleOpenDeleteModal = (review: Review) => {
    setSelectedReviewToDelete(review);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedReviewToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleConfirmDeleteReview = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/deleteresena/${selectedReviewToDelete?.idResena}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar la reseña");
      }
      const updatedReviews = reviews.filter(
        (review) => review.idResena !== selectedReviewToDelete?.idResena
      );
      setReviews(updatedReviews);
      setDeleteModalOpen(false);
      setSelectedReviewToDelete(null); // Establecer selectedReviewToDelete a null después de eliminar con éxito
    } catch (error) {
      console.error("Error al eliminar la reseña:", error);
      setDeleteModalOpen(false);
    }
  };
  

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/updateresena/${selectedReview?.idResena}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editedReview,
            userId: userId,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar la reseña");
      }
      const updatedReview = await response.json();
      const updatedReviews = reviews.map((review) =>
        review.idResena === selectedReview?.idResena ? updatedReview : review
      );
      setReviews(updatedReviews);
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar la reseña:", error);
      setEditModalOpen(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const handleRatingChange = (
    event: ChangeEvent<{}>,
    newValue: number | null
  ) => {
    setRatingValue(newValue || 0); // Manejar el cambio de valor del Rating y actualizar el estado
    setEditedReview((prevReview) => ({
      ...prevReview,
      calificacion: newValue || 0, // Actualizar la calificación de la reseña editada
    }));
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4">Reseñas</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box mt={4} display="flex" flexDirection="column">
            {reviews.map((review, index) => (
              <Box
                key={index}
                mt={2}
                p={2}
                border="1px solid #ccc"
                borderRadius={4}
              >
                <Typography variant="h6">{`Reseña ${new Date(review.fechaResena).toISOString().replace('T', '  ').slice(0, -5)}`}</Typography>

                <Typography>Producto:<b>{` ${review.producto.nombre}`}</b></Typography>

                <Typography>{`Comentario: ${review.comentario}`}</Typography>

                <Typography>
                  Calificación:
                  <Rating
                    name="read-only"
                    value={review.calificacion}
                    readOnly
                  />
                </Typography>{" "}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEditReview(review)}
                >
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleOpenDeleteModal(review)}
                >
                  Eliminar
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <Dialog open={editModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Editar Reseña</DialogTitle>
        <DialogContent>
          <TextField
            label="comentario"
            name="comentario"
            value={editedReview.comentario}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Typography component="legend">Calificación</Typography>
          <Rating
            name="simple-controlled"
            value={ratingValue}
            onChange={handleRatingChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteModalOpen} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que quieres eliminar esta reseña?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDeleteReview} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserReviews;
