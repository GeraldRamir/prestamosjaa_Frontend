// import "bootstrap/dist/css/bootstrap.min.css";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
// import Alerta from "../components/Alerta";
// import clienteAxios from "../config/axios";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import imagenRegistro from '../assets/logoPrestamos-wBackground-removebg-preview.png';

import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";



const Login = ({ mensaje = "El sistema se ha detenido. Por favor, contactarse con el administrador." }) => {
   const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;
  

  return (
    <div
      className="position-fixed top-50 start-50 translate-middle alert alert-danger shadow-lg rounded-4 border-0 px-5 py-4 d-flex align-items-center gap-3 text-start"
      role="alert"
      style={{ zIndex: 1050, minWidth: "320px", maxWidth: "90%" }}
    >
      <i className="bi bi-exclamation-triangle-fill fs-4 text-danger-emphasis"></i>
      <div className="flex-grow-1">
        <strong className="d-block mb-1">¡Atención!</strong>
        <span>{mensaje}</span>
      </div>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );

  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [mostrarPassword, setMostrarPassword] = useState(false);
  // const [alerta, setAlerta] = useState({});
  // const {setAuth}= useAuth()
  // const navigate= useNavigate()

  // const handleSubmit = async e => {
  //   e.preventDefault();
  //   // Lógica para manejar el envío del formulario
  //   if([email,password].includes('')){
  //     setAlerta({
  //       msg:'Todos los campos son obligatorios',
  //       error:true
  //     })
  //     return
  //   }

  //   try {
  //     const {data}= await clienteAxios.post('/prestamista/login', {email, password})
  //     localStorage.setItem('token', data.token)
  //     console.log(data)
  //     setAuth(data)
  //     navigate('/admin')
      
  //   } catch (error) {
  //     setAlerta({
  //       msg: error.response.data.msg,
  //       error:true
  //     })

      
  //   }  
  // };

  // const{auth}=useAuth()
  // console.log(auth)

  // return (
  //   <>
  //     <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: ' #f7f7f7' }}>
  //       <div className="row w-100 justify-content-center" >
  //         {/* Tarjeta de login con imagen a la izquierda */}
  //         <div className="col-12 col-md-10 col-lg-8">
  //           <div className="card shadow-lg rounded-3 overflow-hidden">
  //             <div className="row g-0">
  //               {/* Imagen de la izquierda */}
  //               <div className="col-md-6">
  //                   <img 
  //                                                         src={imagenRegistro} 
  //                                                         alt="Imagen de Login"
  //                                                         className="img-fluid h-100 w-100 object-cover" 
  //                                                         style={{ objectPosition: 'center', height: '100%', objectFit: 'cover' }} 
  //                                                     />
  //               </div>

  //               {/* Formulario a la derecha */}
  //               <div className="col-md-6 d-flex flex-column justify-content-center p-5">
  //                 <h3 className="text-center fw-bold mb-4" style={{ fontSize: '2rem', color: '#339966' }}>Iniciar Sesión</h3>
  //                 <Alerta alerta={alerta} />

  //                 <form onSubmit={handleSubmit}>
  //                   <div className="mb-4">
  //                     <label className="form-label fw-bold" style={{ fontSize: '1rem', color: '#333' }}>EMAIL</label>
  //                     <input
  //                       type="email"
  //                       className="form-control form-control-lg"
  //                       placeholder="Correo electrónico"
  //                       value={email}
  //                       onChange={(e) => setEmail(e.target.value)}
  //                       style={{ borderRadius: '8px', backgroundColor: '#f1f1f1' }}
  //                     />
  //                   </div>
  //                   <div className="mb-4">
  //       <label className="form-label fw-bold" style={{ fontSize: '1rem', color: '#333' }}>CONTRASEÑA</label>
  //       <div className="input-group">
  //         <input
  //           type={mostrarPassword ? "text" : "password"}
  //           className="form-control form-control-lg"
  //           placeholder="password"
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //           style={{ borderRadius: '8px', backgroundColor: '#f1f1f1' }}
  //         />
  //         <span
  //           className="input-group-text"
  //           style={{ cursor: "pointer" }}
  //           onClick={() => setMostrarPassword(!mostrarPassword)}
  //         >
  //           {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
  //         </span>
  //       </div>
  //     </div>

  //                   <div className="d-flex justify-content-between align-items-center mb-4">
  //                     <div className="form-check">
  //                       <input className="form-check-input" type="checkbox" />
  //                       <label className="form-check-label" style={{ fontSize: '0.9rem' }}>Recordar sesión</label>
  //                     </div>
  //                     <Link to="/olvide-password" className="text-success text-decoration-none" style={{ fontSize: '0.9rem' }}>¿Olvidaste tu contraseña?</Link>
  //                   </div>

  //                   <button
  //                     type="submit"
  //                     className="btn w-100 py-3 mb-4 fw-bold"
  //                     style={{ borderRadius: '8px', fontSize: '1.2rem', transition: 'all 0.3s ease', backgroundColor: '#339966', color: '#fff' }}
  //                   >
  //                     Iniciar Sesión
  //                   </button>
  //                 </form>

  //                 <p className="text-center" style={{ fontSize: '1rem' }}>
  //                   ¿No tienes cuenta? <Link to="/registrar" className="text-success">Regístrate aquí</Link>
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     <style>
  //       {`
  //         /* Animaciones de los inputs y botón */
  //         .form-control:focus {
  //           border-color:rgb(0, 179, 119);
  //           box-shadow: 0 0 10px rgba(97, 205, 180, 0.96);
  //         }

  //         .btn:hover {
  //           background-color: #004085;
  //           transform: translateY(-2px);
  //           box-shadow: 0 4px 10px rgb(38, 156, 111);
  //         }

  //         .card {
  //           box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  //         }

  //         /* Estilo del placeholder */
  //         input::placeholder {
  //           color: #7d7d7d;
  //           font-size: 1rem;
  //         }

  //         /* Asegurarse de que la imagen cubra el espacio */
  //         .img-fluid {
  //           object-fit: cover;
  //         }
  //       `}
  //     </style>
  //   </>
  // );
};

export default Login;
