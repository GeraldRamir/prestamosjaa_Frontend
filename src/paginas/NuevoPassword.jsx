import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/axios";

const NuevoPassword = () => {
  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");
  const [alerta, setAlerta] = useState({});
  const [tokenValido, setTokenValido] = useState(false);
  const [passwordActualizado, setPasswordActualizado] = useState(false); // Nuevo estado para controlar la actualización
  const params = useParams();
  const { token } = params;

  useEffect(() => {
    const compararToken = async () => {
      try {
        await clienteAxios(`/prestamista/olvide-password/${token}`);
        setAlerta({
          msg: "Coloca tu nuevo password",
          error: false,
        });
        setTokenValido(true);
      } catch (error) {
        setAlerta({ msg: 'Hubo un error con el enlace', error: true });
        console.log("Alerta: Error con el enlace"); // Verifica si se llega aquí
      }
    };
    compararToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([password, repetirPassword].includes("")) {
      setAlerta({ msg: "Todos los campos son obligatorios", error: true });
      return;
    }

    if (password !== repetirPassword) {
      setAlerta({ msg: "Las contraseñas no coinciden", error: true });
      return;
    }

    if (password.length < 6) {
      setAlerta({
        msg: "La contraseña es muy corta, agrega mínimo 6 caracteres",
        error: true,
      });
      return;
    }

    try {
      const url = `/prestamista/olvide-password/${token}`;
      const { data } = await clienteAxios.post(url, { password });

      setAlerta({
        msg: data.msg,
        error: false,
      });
      setPasswordActualizado(true); // Cambiar el estado para mostrar el botón de inicio de sesión
    } catch (error) {
      setAlerta({
        msg: error.response?.data.msg || "Hubo un error al actualizar la contraseña",
        error: true,
      });
    }
  };

  return (
    <>
      <div
        className="container-fluid d-flex justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "#f7f7f7" }}
      >
        <div className="row w-100 justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-lg rounded-3 overflow-hidden">
              <div className="row g-0">
                {/* Imagen de la izquierda */}
                <div className="col-md-6">
                  <img
                    src="./src/assets/logoPrestamos-wBackground-removebg-preview.png"
                    alt="Confirmar Cuenta"
                    className="img-fluid h-100 w-100 object-cover"
                    style={{
                      objectPosition: "center",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Formulario a la derecha */}
                <div className="col-md-6 d-flex flex-column justify-content-center p-3">
                  <h3
                    className="text-center fw-bold mb-4"
                    style={{ fontSize: "1.75rem", color: "#339966" }}
                  >
                    Establecer una nueva contraseña
                  </h3>

                  {/* Mostrar alerta si hay un mensaje */}
                  <Alerta alerta={alerta} />
                  {tokenValido && !passwordActualizado && (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label
                          className="form-label fw-bold"
                          style={{ fontSize: "1rem", color: "#333" }}
                        >
                          NUEVA CONTRASEÑA
                        </label>
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          placeholder="Nueva contraseña"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={{ borderRadius: "8px", backgroundColor: "#f1f1f1" }}
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label fw-bold"
                          style={{ fontSize: "1rem", color: "#333" }}
                        >
                          REPETIR CONTRASEÑA
                        </label>
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          placeholder="Repite la nueva contraseña"
                          value={repetirPassword}
                          onChange={(e) => setRepetirPassword(e.target.value)}
                          style={{ borderRadius: "8px", backgroundColor: "#f1f1f1" }}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn w-100 py-3 mb-4 fw-bold"
                        style={{
                          borderRadius: "8px",
                          fontSize: "1.2rem",
                          transition: "all 0.3s ease",
                          backgroundColor: "#339966",
                          color: "#fff",
                        }}
                      >
                        Actualizar Contraseña
                      </button>
                    </form>
                  )}

                  {/* Mostrar botón de iniciar sesión después de actualizar la contraseña */}
                  {passwordActualizado && (
                    <div className="text-center">
                      <p>Tu contraseña ha sido actualizada exitosamente.</p>
                      <Link
                        to="/"
                        className="btn btn-success w-100 py-3 fw-bold"
                        style={{
                          borderRadius: "8px",
                          fontSize: "1.2rem",
                        }}
                      >
                        Iniciar sesión
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .card {
            box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
          }

          .form-control:focus {
            border-color: rgb(0, 179, 119);
            box-shadow: 0 0 10px rgba(97, 205, 180, 0.96);
          }

          .btn:hover {
            background-color: #004085;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgb(38, 156, 111);
          }

          input::placeholder {
            color: #7d7d7d;
            font-size: 1rem;
          }
        `}
      </style>
    </>
  );
};

export default NuevoPassword;
