import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Alerta from "../components/Alerta";
import { Link } from "react-router-dom";
import clienteAxios from "../config/axios";
import useAuth from "../hooks/useAuth";

const OlvidePassword = () => {
  const [email, setEmail] = useState('');
  const [alerta, setAlerta] = useState({});
  const {auth}= useAuth()
  console.log(auth)

  const handleSubmit = async e => {
    e.preventDefault();
    // Lógica para manejar el envío del formulario de recuperación de contraseña
    if(email===''|| email.length<6){
      setAlerta({
        msg:"El email es obligatorio",
        error:true
      })
      return
    }
    try {
    const {data}= await clienteAxios.post('/prestamista/olvide-password',{email})
    setAlerta({
      msg: data.msg,
      error: false
    })
      
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error:true
      })
      
    }
  };

  return (
    <>
      <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f7f7f7' }}>
        <div className="row w-100 justify-content-center">
          {/* Tarjeta de Olvidé la Contraseña con imagen */}
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-lg rounded-3 overflow-hidden">
              <div className="row g-0">
                {/* Imagen a la izquierda */}
                <div className="col-md-6">
                  <img
                    src="./src/assets/logoPrestamos-wBackground-removebg-preview.png"
                    alt="Imagen de Olvidé la Contraseña"
                    className="img-fluid h-100 w-100 object-cover"
                    style={{ objectPosition: 'center' }}
                  />
                </div>

                {/* Formulario a la derecha */}
                <div className="col-md-6 d-flex flex-column justify-content-center p-5">
                  <h3 className="text-center fw-bold mb-4" style={{ fontSize: '2rem', color: '#339966' }}>Recuperar Contraseña</h3>
                  
                  {/* Mostrar alerta si hay un mensaje */}
                  <Alerta alerta={alerta} />

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-bold" style={{ fontSize: '1rem', color: '#333' }}>EMAIL</label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ borderRadius: '8px', backgroundColor: '#f1f1f1' }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn w-100 py-3 mb-4 fw-bold"
                      style={{ borderRadius: '8px', fontSize: '1.2rem', transition: 'all 0.3s ease', backgroundColor: '#339966', color: '#fff' }}
                    >
                      Enviar Instrucciones
                    </button>
                  </form>

                  <p className="text-center" style={{ fontSize: '1rem' }}>
                    ¿Recuerdas tu contraseña? <Link to="/" className="text-success">Inicia sesión aquí</Link>
                  </p>
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

export default OlvidePassword;
