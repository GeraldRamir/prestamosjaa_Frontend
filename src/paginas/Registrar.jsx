import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/axios";
import imagenRegistro from '../assets/logoPrestamos-wBackground-removebg-preview.png';


const Registrar = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repetirPassword, setRepetirPassword] = useState('');
    const [alerta, setAlerta] = useState({});

    const handleSubmit = async e => {
        e.preventDefault();

        // Lógica para manejar el envío del formulario
        if([nombre, email, password, repetirPassword].includes('')) {
            setAlerta({ msg: 'Todos los campos son obligatorios', error: true });
            return;
        }

        if(password !== repetirPassword) {
            setAlerta({ msg: 'Las contraseñas no coinciden', error: true });
            return;
        }

        if(password.length < 6) {
            setAlerta({ msg: 'La contraseña es muy corta, agrega mínimo 6 caracteres', error: true });
            return;
        }
    
        try {
            
            await clienteAxios.post('/prestamista', {nombre,email,password});
            setAlerta({ msg: 'Usuario creado correctamente, revisa tu email', error: false });
        } catch (error) {
           setAlerta({ msg: error.response.data.msg, error: true });
        }
    

    };
 
    return (
        <>
            <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f7f7f7' }}>
                <div className="row w-100 justify-content-center">
                    {/* Tarjeta de registro con imagen a la izquierda */}
                    <div className="col-12 col-md-10 col-lg-8">
                        <div className="card shadow-lg rounded-3 overflow-hidden">
                            <div className="row g-0">
                                {/* Imagen de la izquierda */}
                                <div className="col-md-6">
                                    <img 
                                        src={imagenRegistro} 
                                        alt="Imagen de Login"
                                        className="img-fluid h-100 w-100 object-cover" 
                                        style={{ objectPosition: 'center', height: '100%', objectFit: 'cover' }} 
                                    />
                                </div>

                                {/* Formulario a la derecha */}
                                <div className="col-md-6 d-flex flex-column justify-content-center p-3">
                                    <h3 className="text-center fw-bold mb-4" style={{ fontSize: '1.75rem', color: '#339966' }}>Crea una cuenta</h3>

                                    {/* Mostrar alerta si hay un mensaje */}
                                    <Alerta alerta={alerta} />

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold" style={{ fontSize: '1rem', color: '#333' }}>NOMBRE</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                placeholder="Nombre de usuario"
                                                value={nombre}
                                                onChange={e => setNombre(e.target.value)}
                                                style={{ borderRadius: '8px', backgroundColor: '#f1f1f1' }}
                                            />
                                        </div>
                                        <div className="mb-3">
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

                                        <div className="mb-3">
                                            <label className="form-label fw-bold" style={{ fontSize: '1rem', color: '#333' }}>CONTRASEÑA</label>
                                            <input
                                                type="password"
                                                className="form-control form-control-lg"
                                                placeholder="Contraseña"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                style={{ borderRadius: '8px', backgroundColor: '#f1f1f1' }}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold" style={{ fontSize: '1rem', color: '#333' }}>REPETIR CONTRASEÑA</label>
                                            <input
                                                type="password"
                                                className="form-control form-control-lg"
                                                placeholder="Repite la contraseña"
                                                value={repetirPassword}
                                                onChange={(e) => setRepetirPassword(e.target.value)}
                                                style={{ borderRadius: '8px', backgroundColor: '#f1f1f1' }}
                                            />
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" />
                                                <label className="form-check-label" style={{ fontSize: '0.9rem' }}>Recordar sesión</label>
                                            </div>
                                            <Link to="/olvide-password" className="text-success text-decoration-none" style={{ fontSize: '0.9rem' }}>¿Olvidaste tu contraseña?</Link>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn w-100 py-3 mb-4 fw-bold"
                                            style={{ borderRadius: '8px', fontSize: '1.2rem', transition: 'all 0.3s ease', backgroundColor: '#339966', color: '#fff' }}
                                        >
                                            Registrarse
                                        </button>
                                    </form>

                                    <p className="text-center" style={{ fontSize: '1rem' }}>
                                        ¿Ya tienes cuenta? <Link to="/" className="text-success">Inicia sesión aquí</Link>
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

export default Registrar;
