import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import UserProfile from "../MainVisual/Profile";
import {
  AppBar,
  Avatar,
  Badge,
  Container,
  Divider,
  IconButton,
  Menu,
  Toolbar,
  Typography,
} from "@mui/material";
import UserAddresses from "../MainVisual/ViewUserDirections";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsIcon from "@mui/icons-material/Directions";
import LogoutIcon from "@mui/icons-material/Logout";
import BrandCard from "../Cards/CardMarca";
import { Grid } from "@mui/material";
import ModelCard from "../Cards/CardModelo";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import ProductCard from "../Cards/CardProducto";
import GradeIcon from "@mui/icons-material/Grade";
import UserReviews from "../MainVisual/ViewUserResenas";
import * as React from "react";
import { Link } from 'react-router-dom';
import PedidosUsuario from "../MainVisual/ViewUserAllOrders";
import { Paint } from "../../paint/Paint";
import { PaintDemo } from "../../paint/PaintDemo";

interface CartItem {
  idProducto: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export const MainPage = () => {
  const icons: { [key: string]: JSX.Element } = {
    "Main Page": <HomeIcon />,
    Perfil: <PersonIcon />,
    Direcciones: <DirectionsIcon />,
    Pedidos: <InboxOutlinedIcon />,
    Reseñas: <GradeIcon />,
    Logout: <LogoutIcon color="error" />,
  };


  const [selectedOption, setSelectedOption] = useState("Main Page");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const storedCartJSON = sessionStorage.getItem("cart");
  const storedCart: CartItem[] = storedCartJSON
    ? JSON.parse(storedCartJSON)
    : [];
  const [totalItemsInCart, setTotalItemsInCart] = useState(0);

  useEffect(() => {
    const total = storedCart.reduce((total, item) => total + item.cantidad, 0);
    setTotalItemsInCart(total);
  }, [storedCart]);
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const total = storedCart.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  const handleCartIconClick = () => {
    setOpenCartDrawer(!openCartDrawer);
  };

  const handleOptionClick = (option: string) => {
    setLoading(true);
    if (option === "Logout") {
      sessionStorage.clear();
      window.location.href = "/"; 
    } else if (option === "Marcas") {
      fetchBrands();
      setSelectedOption(option);
      setOpen(false);
    } else if (option === "Modelos") {
      fetchModels();
      setSelectedOption(option);
      setOpen(false);
    } else if (option === "Productos") {
      fetchProducts();
      setSelectedOption(option);
      setOpen(false);
    } else if (option === "Diseñar") {
      setSelectedOption(option);
      setOpen(false);
    
    } else {
      setSelectedOption(option);
      setOpen(false);
    }
  };

  const clearCart = () => {
    setStoredCart([]);
  };

  const getContent = () => {
    switch (selectedOption) {
      case "Perfil":
        return <UserProfile />;
      case "Direcciones":
        return <UserAddresses />;
      case "Pedidos":
        return <PedidosUsuario />;
      case "Marcas":
        return (
          <div>
            <h2>Todas las Marcas</h2>
            <Grid container spacing={2}>
              {brands.map((brand) => (
                <BrandCard key={brand.idMarca} brand={brand} />
              ))}
            </Grid>
          </div>
        );
      case "Modelos":
        return (
          <div>
            <h2>Todos los modelos</h2>
            <Grid container spacing={2}>
              {models.map((model) => (
                <ModelCard key={model.idModelo} model={model} />
              ))}
            </Grid>
          </div>
        );
      case "Diseñar":
        return <PaintDemo />;
      case "Productos":
        return (
          <div>
            <h2>Todos los Productos</h2>
            <Grid container spacing={2}>
              {product.map((product) => (
                <ProductCard key={product.idProducto} product={product} />
              ))}
            </Grid>
          </div>
        );
      case "Reseñas":
        return <UserReviews />;
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
          "Perfil",
          "Direcciones",
          "Pedidos",
          "Reseñas",
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
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [product, setProducts] = useState<any[]>([]);
  const [resena, setResena] = useState<any[]>([]);
  const [storedCartUp, setStoredCart] = useState<CartItem[]>([]); 

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
    fetch(`https://motographixapi.up.railway.app/finduserid/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => console.error("Error al obtener el usuario:", error));
  };

  const fetchBrands = () => {
    fetch("https://motographixapi.up.railway.app/marcas")
      .then((response) => response.json())
      .then((data) => {
        setBrands(data);
      })
      .catch((error) => console.error("Error al obtener las marcas:", error));
  };

  const fetchModels = () => {
    fetch("https://motographixapi.up.railway.app/modelos")
      .then((response) => response.json())
      .then((data) => {
        setModels(data);
      })
      .catch((error) => console.error("Error al obtener las modelos:", error));
  };

  const fetchProducts = () => {
    fetch("https://motographixapi.up.railway.app/productos")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) =>
        console.error("Error al obtener las productos:", error)
      );
  };

  const decreaseQuantity = (productId: number) => {
    const updatedCart = storedCart
      .map((item) => {
        if (item.idProducto === productId) {
          if (item.cantidad > 1) {
            return { ...item, cantidad: item.cantidad - 1 };
          } else {
            return null;
          }
        }
        return item;
      })
      .filter((item) => item !== null) as CartItem[]; // Filtrar elementos null y asignar el tipo CartItem
  
    setStoredCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (productId: number) => {
    const updatedCart = storedCart.map((item) => {
      if (item.idProducto === productId) {
        return { ...item, cantidad: item.cantidad + 1 };
      }
      return item;
    });
  
    setStoredCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = storedCart.filter(
      (item) => item.idProducto !== productId
    );
  
    setStoredCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "black" }}>
        <Container className="nav" maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              noWrap
              component="a"
              href="/home"
              sx={{
                mr: 1,
                display: { xs: "none", md: "flex" },
              }}
            >
              <img
                src="/dist/assets/img/Logo.png"
                alt="LogoApp"
                style={{ width: "300px" }}
              />
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <h1></h1>
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
            <Button onClick={() => handleOptionClick("Marcas")}>Marcas</Button>
            <Button onClick={() => handleOptionClick("Modelos")}>
              Modelos
            </Button>
            <Button onClick={() => handleOptionClick("Productos")}>
              Productos
            </Button>
            <Button onClick={() => handleOptionClick("Diseñar")}>Diseñar</Button>

            <Badge badgeContent={totalItemsInCart} color="primary">
              <Button onClick={handleCartIconClick}>
                <ShoppingCartOutlinedIcon />
              </Button>
            </Badge>

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
      <Drawer
        anchor="right"
        open={openCartDrawer}
        onClose={() => setOpenCartDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 350,
            padding: 2,
          },
        }}
      >
        {storedCart.length === 0 ? (
          <Typography variant="h6" sx={{ mb: 2 }}>
            No hay productos en la cesta
          </Typography>
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Tu Carrito
            </Typography>
            <Box sx={{ maxHeight: 650,minHeight: 650, overflow: "auto", overflowX: "hidden" }}>
            <List>
              {storedCart.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      paddingY: 1,
                    }}
                  >
                    <ListItemText
                      primary={`${item.nombre}`}
                      secondary={`Precio: ${item.precio}€  Cantidad: ${item.cantidad}`}
                      sx={{ marginBottom: 1 }}
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => decreaseQuantity(item.idProducto)}
                      >
                        -
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => increaseQuantity(item.idProducto)}
                      >
                        +
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => removeFromCart(item.idProducto)}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </ListItem>
                  {index < storedCart.length - 1 && <Divider sx={{ my: 2 }} />}
                </React.Fragment>
              ))}
            </List>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Total: {total.toFixed(2)}€
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setOpenCartDrawer(false)}
                  
                >
                  Cerrar
                </Button>
                <Link to="/pago/detalles">
                <Button variant="contained" color="primary">
                  Pagar
                </Button>
                </Link>
              </Box>
            </Box>
          </>
        )}
      </Drawer>

      {getContent()}
    </>
  );
};
