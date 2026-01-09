import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import clienteAxios from "../config/axios";
import { useParams, Link } from "react-router-dom";
import Alerta from "../components/Alerta";

const ConfirmarCuenta = () => {
    const { token } = useParams();
    console.log("Token recibido:", token);

    const [cargando, setCargando] = useState(true);
    const [cuentaConfirmada, setCuentaConfirmada] = useState(false);
    const [alerta, setAlerta] = useState({ msg: "", error: false });

    useEffect(() => {
        const confirmarCuenta = async () => {
            try {
                const url = `/prestamista/confirmar/${token}`;
                console.log(url);
                const { data } = await clienteAxios.get(url);
                console.log(data);
                setCargando(false);
                setCuentaConfirmada(true);
                // setAlerta({ msg: data.msg, error: false });
            } catch (error) {
                console.log(error);
                setCargando(false);
                setAlerta({ msg: "Hubo un problema al confirmar tu cuenta. Intenta nuevamente.", error: true });
            }
        };
        confirmarCuenta();
    }, [token]);

    return (
        <>
            <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f7f7f7' }}>
                <div className="row w-100 justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">
                        <div className="card shadow-lg rounded-3 overflow-hidden">
                            <div className="row g-0">
                                <div className="col-md-6">
                                    <img
                                        src="/src/assets/istockphoto-2100443303-612x612.jpg"
                                        alt="Confirmar Cuenta"
                                        className="img-fluid h-100 w-100 object-cover"
                                        style={{ objectPosition: 'center', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>

                                <div className="col-md-6 d-flex flex-column justify-content-center p-3">
                                    <h3 className="text-center fw-bold mb-4" style={{ fontSize: '1.75rem', color: '#339966' }}>Confirma tu cuenta</h3>

                                    {/* Alerta */}
                                    <Alerta alerta={alerta} />

                                    {cargando ? (
                                        <div className="d-flex justify-content-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Cargando...</span>
                                            </div>
                                        </div>
                                    ) : cuentaConfirmada ? (
                                        <div className="text-center">
                                            <p className="text-success">Tu cuenta ha sido confirmada exitosamente.</p>
                                            <Link to="/" className="btn w-100 py-3 fw-bold" style={{ borderRadius: '8px', fontSize: '1.2rem', backgroundColor: '#339966', color: '#fff' }}>
                                                Inicia Sesión
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-danger">Hubo un problema al confirmar tu cuenta. Intenta nuevamente.</p>
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

                    .btn:hover {
                        background-color: #004085;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 10px rgb(38, 156, 111);
                    }
                `}
            </style>
        </>
    );
};

export default ConfirmarCuenta;
