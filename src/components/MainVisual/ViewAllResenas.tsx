import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import { Rating } from "@mui/material";

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

export const ViewAllReviews = () => {
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [reviewIdToDelete, setReviewIdToDelete] = React.useState<number | null>(
    null
  );
  const [deletedReviewTitle, setDeletedReviewTitle] =
    React.useState<string>("");

  React.useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("https://motographixapi.up.railway.app/resenas");
        if (!response.ok) {
          throw new Error("Error al obtener las reseñas");
        }
        const data = await response.json();
        setReviews(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las reseñas:", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    setReviewIdToDelete(id);
    setDeletedReviewTitle(title);
    setOpenModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `https://motographixapi.up.railway.app/deleteresena/${reviewIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Error al eliminar la reseña");
      }
      const updatedReviews = reviews.filter(
        (review) => review.id !== reviewIdToDelete
      );
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Error al eliminar la reseña:", error);
    } finally {
      setOpenModal(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "calificacion",
      headerName: "Título",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Rating
          name="read-only"
          value={params.row.calificacion}
          precision={0.5}
          readOnly
          size="medium"
          color="red"
        />
      ),
    },
    { field: "comentario", headerName: "Comentario", width: 400 },
    { field: "fechaResena", headerName: "Fecha de cración", width: 400 },
    {
      field: "usuario",
      headerName: "Ususario",
      width: 400,
      renderCell: (params: GridRenderCellParams) => params.row.usuario.nombre,
    },
    {
      field: "producto",
      headerName: "Producto",
      width: 400,
      renderCell: (params: GridRenderCellParams) => params.row.producto.nombre,
    },
  ];

  return (
    <>
      <h2>Reseñas</h2>
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
            rows={reviews}
            columns={columns}
            getRowId={(row) => row.idResena}
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
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" id="modal-title">
            Confirmar eliminación de reseña
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            ¿Estás seguro de que deseas eliminar la reseña{" "}
            <b>{deletedReviewTitle}</b>?
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
    </>
  );
};
