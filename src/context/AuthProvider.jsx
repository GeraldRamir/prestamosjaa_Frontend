import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/axios";
// import 'index.css'; // o './App.css'


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [cargando, setCargando] = useState(true);
  const [auth, setAuth] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setCargando(false);
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const { data } = await clienteAxios("/prestamista/perfil", config);
        setAuth(data);
      } catch (error) {
        console.log(error.response?.data?.msg);
        setAuth({});
      }
      setCargando(false);
    };
    autenticarUsuario();
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setAuth({});
    setShowLogoutModal(false);
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        cargando,
        cerrarSesion: () => setShowLogoutModal(true),
      }}
    >
      {children}
        {/* Animación embebida */}
  <style>
    {`
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `}
  </style>

      {/* Modal personalizado */}
      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c2c7",
              borderRadius: "10px",
              width: "400px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              animation: "fadeInScale 0.3s ease-in-out",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <span
                style={{
                  fontSize: "24px",
                  marginRight: "10px",
                  color: "#842029",
                }}
              >
                ⚠️
              </span>
              <strong style={{ color: "#842029", fontSize: "18px" }}>
                ¿Cerrar sesión?
              </strong>
            </div>
            <p style={{ color: "#842029", marginBottom: "20px" }}>
              ¿Estás seguro de que deseas cerrar sesión?
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  backgroundColor: "#f5c2c7",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "5px",
                  color: "#842029",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={cerrarSesion}
                style={{
                  backgroundColor: "#842029",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "5px",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
