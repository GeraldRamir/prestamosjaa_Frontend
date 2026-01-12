import React, { useState, useContext, useEffect } from 'react';
import useClientes from "../hooks/useClientes";
import feather from 'feather-icons';

const ModalEditarCliente = ({ cliente, cerrarModal }) => {
    const { editarCliente, obtenerClientes } = useClientes();
    
    // Función para formatear fecha
    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        if (typeof fecha === 'string') {
            // Si contiene 'T' (formato ISO), tomar solo la parte de la fecha
            if (fecha.includes('T')) {
                return fecha.split('T')[0];
            }
            // Si contiene espacio, tomar solo la parte de la fecha
            if (fecha.includes(' ')) {
                return fecha.split(' ')[0];
            }
            // Si ya está en formato YYYY-MM-DD, devolverlo tal cual
            return fecha;
        }
        return '';
    };
    
    const [formData, setFormData] = useState({
        ...cliente,
        // Formatear fechas para que funcionen con input type="date"
        FechaIngreso: formatearFecha(cliente.FechaIngreso),
        FechaPago: formatearFecha(cliente.FechaPago)
    });
    
    // Actualizar formData cuando cambie el cliente
    useEffect(() => {
        setFormData({
            ...cliente,
            FechaIngreso: formatearFecha(cliente.FechaIngreso),
            FechaPago: formatearFecha(cliente.FechaPago)
        });
    }, [cliente]);
    
    console.log(formData.nombreUbicacion)
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    

      useEffect(() => {
        feather.replace();
      });

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          console.log("Datos a guardar:", formData); // 🔍
          await editarCliente(formData);
          await obtenerClientes(); // 👈 vuelve a cargar todos los clientes
        } catch (error) {
          console.error("Error al editar cliente:", error);
        } finally {
          cerrarModal(); // Siempre cerrar el modal, incluso si hay errores
        }
    };

    // const FechaPagoModificada = formData.FechaPago ? formData.FechaPago.slice(0, 10) : '';
    // const FechaIngresoModificada = formData.FechaIngreso ? formData.FechaIngreso.slice(0, 10) : '';
    

    return (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 9999,
                    maxHeight: "90vh", // Limitar la altura del modal
                    overflowY: "auto", // Permitir scroll si hay muchos campos
                }}
            >
                <div
                    style={{
                        backgroundColor: "#fff9e6",
                        border: "1px solid #f5d3a1",
                        borderRadius: "20px",
                        padding: "20px",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                        fontFamily: "Arial, sans-serif",
                        width: "420px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "15px",
                        }}
                    >
                        <i
                            data-feather="edit-2"
                            className="me-2"
                            style={{
                                fontSize: "32px",
                                marginRight: "12px",
                                color: "#ff6f00",
                            }}
                        ></i>
                        <strong style={{ color: "#ff6f00", fontSize: "20px" }}>
                            Editar Cliente
                        </strong>
                    </div>
                    <div style={{ color: "#ff6f00", marginBottom: "20px" }}>
                        Modifica los datos del cliente según sea necesario.
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-muted">Nombre</label>
                            <div className="d-flex align-items-center">
                               <i data-feather="user" className="me-2"   style={{ color: "#ff6f00", marginRight: "10px" }}></i>
                                <input
                                    type="text"
                                    className="form-control rounded-3 border-light shadow-sm"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: "25px" }}
                                />
                            </div>
                        </div>
         
                        <div className="mb-3">
                            <label className="form-label text-muted">Telefono</label>
                            <div className="d-flex align-items-center">
                               <i data-feather="briefcase" className="me-2"   style={{ color: "#ff6f00", marginRight: "10px" }}></i>
                                <input
                                    type="number"
                                    className="form-control rounded-3 border-light shadow-sm"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: "25px" }}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted">Cédula</label>
                            <div className="d-flex align-items-center">
                               <i data-feather="credit-card" className="me-2"   style={{ color: "#ff6f00", marginRight: "10px" }}></i>
                                <input
                                    type="number"
                                    className="form-control rounded-3 border-light shadow-sm"
                                    name="copiaCedula"
                                    value={formData.copiaCedula || ''}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: "25px" }}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted">Empresa</label>
                            <div className="d-flex align-items-center">
                               <i data-feather="users" className="me-2"   style={{ color: "#ff6f00", marginRight: "10px" }}></i>
                                <input
                                    type="text"
                                    className="form-control rounded-3 border-light shadow-sm"
                                    name="Empresa"
                                    value={formData.Empresa}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: "25px" }}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted">Banco</label>
                            <div className="d-flex align-items-center">
                               <i data-feather="briefcase" className="me-2"   style={{ color: "#ff6f00", marginRight: "10px" }}></i>
                                <input
                                    type="text"
                                    className="form-control rounded-3 border-light shadow-sm"
                                    name="bank"
                                    value={formData.bank}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: "25px" }}
                                />
                            </div>
                        </div>
                        {/* Agrega más campos aquí */}
                        <div className="mb-3">
                            <label className="form-label text-muted">Fecha Ingreso</label>
                            <div className="d-flex align-items-center">
                               <i data-feather="calendar" className="me-2"   style={{ color: "#ff6f00", marginRight: "10px" }}></i>
                                <input
                                    type="date"
                                    className="form-control rounded-3 border-light shadow-sm"
                                    name="FechaIngreso"
                                    value={formData.FechaIngreso}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: "25px" }}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted">Fecha de Pago</label>
                            <div className="d-flex align-items-center">
                               <i data-feather="calendar" className="me-2"   style={{ color: "#ff6f00", marginRight: "10px" }}></i>
                                <input
                                    type="date"
                                    className="form-control rounded-3 border-light shadow-sm"
                                    name="FechaPago"
                                    value={formData.FechaPago}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: "25px" }}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted">Numero de cuenta</label>
                            <div className="d-flex align-items-center">
                               <i data-feather="minus-square" className="me-2"   style={{ color: "#ff6f00", marginRight: "10px" }}></i>
                                <input
                                    type="number"
                                    className="form-control rounded-3 border-light shadow-sm"
                                    name="NumeroCuenta"
                                    value={formData.NumeroCuenta}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: "25px" }}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted">Clave de tarjeta</label>
                            <div className="d-flex align-items-center">
                               <i data-feather="minus-square" className="me-2"   style={{ color: "#ff6f00", marginRight: "10px" }}></i>
                                <input
                                    type="number"
                                    className="form-control rounded-3 border-light shadow-sm"
                                    name="Clavedetarjeta"
                                    value={formData.Clavedetarjeta}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: "25px" }}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted">Ubicacion</label>
                            <div className="d-flex align-items-center">
                            <i data-feather="map-pin" className="me-2"   style={{ color: "#ff6f00", marginRight: "10px" }}></i>
                               
                            <input
                            type="text"
                            className="form-control rounded-3 border-light shadow-sm"
                            name="nombreUbicacion"
                            value={formData.nombreUbicacion}
                            onChange={handleChange}
                            />

                            </div>
                        </div>


                        {/* Botones */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "10px",
                                marginTop: "20px",
                            }}
                        >
                            <button
                                type="submit"
                                className="btn btn-primary rounded-3 px-4 py-2"
                                style={{
                                    backgroundColor: "#ff6f00",
                                    border: "none",
                                    color: "#fff",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s",
                                }}
                                onMouseOver={(e) => (e.target.style.backgroundColor = "#e65100")}
                                onMouseOut={(e) => (e.target.style.backgroundColor = "#ff6f00")}
                            >
                                Guardar Cambios
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary rounded-3 px-4 py-2"
                                onClick={cerrarModal}
                                style={{
                                    backgroundColor: "#e2e6ea",
                                    border: "none",
                                    color: "#6c757d",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s",
                                }}
                                onMouseOver={(e) => (e.target.style.backgroundColor = "#ced4da")}
                                onMouseOut={(e) => (e.target.style.backgroundColor = "#e2e6ea")}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalEditarCliente;
