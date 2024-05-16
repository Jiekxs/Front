import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./auth/pages/LoginPage";
import RegisterPage from "./auth/pages/RegisterPage";
import "./App.css";
import { MainPage } from "./components/Views/MainPage";
import { AdminDashboard } from "./components/Views/AdminDashboard";
import PageNotFound from "./components/Views/PageNotFound";
import ForgotPasswordPage from "./components/Views/ForgotPasswordPage";
import CartView from "./components/MainVisual/CartView";
import PaymentView from "./components/MainVisual/OrderDetails";

const App = () => {
  const getUserRole = () => {
    return sessionStorage.getItem("userRole");
  };

  const getUser = () => {
    const userString = sessionStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };

  const isAdmin = () => {
    return getUserRole() === "admin";
  };

  const isUser= () => {
    return getUserRole() === "cliente";
  };

  const UserRoute: React.FC<{ element: React.ReactNode }> = ({
    element,
    ...rest
  }) => {
    return isUser()||isAdmin() ? element : <Navigate to="*" replace />;
  };

  const AdminRoute: React.FC<{ element: React.ReactNode }> = ({
    element,
    ...rest
  }) => {
    return isAdmin() ? element : <Navigate to="*" replace />;
  };

  const ProtectedLoginRoute: React.FC<{ element: React.ReactNode }> = ({
    element,
    ...rest
  }) => {
      return isAdmin()?<Navigate to="/admin/dashboard" replace /> : element;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<ProtectedLoginRoute element={<LoginPage />} />}
        />
        <Route
          path="/register"
          element={<ProtectedLoginRoute element={<RegisterPage />} />}
        />
        <Route
          path="/forgot-password"
          element={<ProtectedLoginRoute element={<ForgotPasswordPage />} />}
        />
        <Route
          path="/admin/dashboard"
          element={<AdminRoute element={<AdminDashboard />} />}
        />

        <Route
          path="/home"
          element={<UserRoute element={<MainPage />} />}
        />
         <Route
          path="/pago/detalles"
          element={<UserRoute element={<PaymentView />} />}
        />
         <Route
          path="*/dist/*
          "
          element={<UserRoute element={<PaymentView />} />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
