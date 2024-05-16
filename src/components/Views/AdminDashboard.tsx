import { useEffect, useState } from "react";
import { ViewAllMarcas } from "../MainVisual/ViewAllMarcas";
import { ViewAllModels } from "../MainVisual/ViewAllModels";
import { ViewAllUsers } from "../MainVisual/ViewAllUsers";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ViewAllProducts from "../MainVisual/ViewAllProducts";
import UserProfile from "../MainVisual/Profile";
import {
  AppBar,
  Avatar,
  Container,
  IconButton,
  Menu,
  Toolbar,
  Typography,
} from "@mui/material";
import UserAddresses from "../MainVisual/ViewUserDirections";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsIcon from "@mui/icons-material/Directions";
import LogoutIcon from "@mui/icons-material/Logout";
import GradeIcon from "@mui/icons-material/Grade";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { ViewAllReviews } from "../MainVisual/ViewAllResenas";
import Pedidos from "../MainVisual/ViewAllOrders";

export const AdminDashboard = () => {
  const icons: { [key: string]: JSX.Element } = {
    "Main Page": <HomeIcon />,
    Usuarios: <GroupIcon />,
    Marcas: <CategoryIcon />,
    Modelos: <TwoWheelerIcon />,
    Productos: <InboxIcon />,
    Perfil: <PersonIcon />,
    Direcciones: <DirectionsIcon />,
    Reseñas: <GradeIcon />,
    Pedidos: <ShoppingCartCheckoutIcon />,
    Logout: <LogoutIcon color="error" />,
  };

  const [selectedOption, setSelectedOption] = useState("Main Page");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // Estado para almacenar la información del usuario

  const handleOptionClick = (option: string) => {
    if (option === "Logout") {
      sessionStorage.clear();
      window.location.href = "/"; // Redirecciona al usuario a la página de inicio
    } else {
      setSelectedOption(option);
      setOpen(false);
    }
  };

  const getContent = () => {
    switch (selectedOption) {
      case "Usuarios":
        return <ViewAllUsers />;
      case "Marcas":
        return <ViewAllMarcas />;
      case "Modelos":
        return <ViewAllModels />;
      case "Productos":
        return <ViewAllProducts />;
      case "Perfil":
        return <UserProfile />;
      case "Direcciones":
        return <UserAddresses />;
      case "Pedidos":
        return <Pedidos />;
      case "Reseñas":
        return <ViewAllReviews />;
      default:
        return (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h2">
              Bienvenido {user ? user.nombre : ""}
            </Typography>
            <Typography variant="h5">
              Pulse sobre el icono para ver las opciones
            </Typography>
          </Box>
        );
    }
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {[
          "Main Page",
          "Usuarios",
          "Marcas",
          "Modelos",
          "Productos",
          "Perfil",
          "Direcciones",
          "Reseñas",
          "Pedidos",
          "Logout",
        ].map((text) => (
          <ListItem
            key={text}
            disablePadding
            onClick={() => handleOptionClick(text)}
          >
            <ListItemButton>
              <ListItemIcon>{icons[text]}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      fetchUser(userId);
    }
  }, []);

  const fetchUser = (userId: string) => {
    fetch(`http://localhost:8080/finduserid/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => console.error("Error al obtener el usuario:", error));
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "black" }}>
        <Container className="nav" maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              noWrap
              component="a"
              href="/admin/dashboard"
              sx={{
                mr: 1,
                display: { xs: "none", md: "flex" },
              }}
            >
            
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <h1>Admin Dashboard</h1>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              ></IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              ></Menu>
            </Box>

            <Button>
              <Avatar
                onClick={() => setOpen(true)}
                alt={user ? user.nombre : ""}
                src="/static/images/avatar/2.jpg"
                sx={{ width: 56, height: 56 }}
              />
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <br />
      <Drawer open={open} onClose={() => setOpen(false)}>
        {DrawerList}
      </Drawer>
      {getContent()}
    </>
  );
};
