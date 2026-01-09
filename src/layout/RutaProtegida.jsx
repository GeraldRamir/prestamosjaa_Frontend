import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Asegúrate de importar Bootstrap
import Dashboard from "../paginas/Dashboard";
import AlertaMantenimiento from "../components/AlertaMantenimiento";

const RutaProtegida = () => {
  const { auth, cargando } = useAuth();

  if (cargando)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );

  return (
    <>
      {auth?._id ? (
        <>
          <AlertaMantenimiento />
          <div style={{ paddingTop: '90px' }}>
            <Outlet />
          </div>
        </>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default RutaProtegida;
