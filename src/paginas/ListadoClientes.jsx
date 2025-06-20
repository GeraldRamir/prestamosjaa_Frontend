import React, { useState, useEffect, useMemo } from 'react';
import "../styles/app.css";
import "../styles/clases.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import feather from 'feather-icons';
import SimpleBar from "simplebar";
import "simplebar/dist/simplebar.css"; // Asegúrate de importar los estilos de simplebar
import useAuth from "../hooks/useAuth";
import useClientes from "../hooks/useClientes";
import { Link } from "react-router-dom";
import Clientebody from '../components/Clientebody';
import ModalEditarCliente from '../components/ModalEditarCliente';
import Mapa from '../components/Mapa';
import imagenRegistro from '../assets/logoPrestamos-wBackground-removebg-preview.png';



const ListadoClientes = () => {
  const { clientes, editarCliente, eliminarCliente } = useClientes();
  const [collapsed, setCollapsed] = useState(false);
  const { cerrarSesion } = useAuth();

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmarVisible, setModalConfirmarVisible] = useState(false); // Estado para la confirmación de eliminación
  const [clienteAEliminar, setClienteAEliminar] = useState(null); // Estado para almacenar el cliente a eliminar

  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(''); // Estado para la empresa seleccionada
  const [clientesFiltrados, setClientesFiltrados] = useState(clientes); // Estado para los clientes filtrados
    const [mostrarMapa, setMostrarMapa] = useState(false);
    const [ubicacionMapa, setUbicacionMapa] = useState({ lat: null, lng: null });

  // Obtener una lista única de empresas
  const obtenerEmpresasUnicas = (clientes) => {
    const Empresas = clientes.map(cliente => cliente.Empresa); // Cambié 'banco' por 'empresa'
    console.log('Empresas obtenidas:', Empresas); // Verifica que las empresas se están obteniendo correctamente
    return [...new Set(Empresas)]; // Eliminar duplicados
  };
  

  const empresasUnicas = useMemo(() => obtenerEmpresasUnicas(clientes), [clientes]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    initializeSimplebar();
  }, []);

  const initializeSimplebar = () => {
    const simplebarElement = document.getElementsByClassName("js-simplebar")[0];
    if (simplebarElement) {
      new SimpleBar(simplebarElement);
    }
  };

  useEffect(() => {
    feather.replace(); // Reemplazar íconos de Feather después del renderizado
  }, []);

  // Función para manejar la edición de clientes
  const handleEditClick = async (cliente) => {
    try {
      await editarCliente(cliente); // Llama a la función para actualizar el cliente en la API
      setClienteSeleccionado(cliente);
      console.log("Cliente seleccionado para edición:", cliente);
      setModalVisible(true); // Mostrar modal al editar cliente
    } catch (error) {
      console.error("Error al editar el cliente:", error);
    }
  };

  // Función para manejar la eliminación de clientes
  const handleDeleteClick = (id) => {
 

      setClienteAEliminar(id); // Guardar el ID del cliente a eliminar
      setModalConfirmarVisible(true); // Mostrar el modal de confirmación
    
  };

  const confirmarEliminacion = async () => {
    await eliminarCliente(clienteAEliminar); // Eliminar cliente
    setModalConfirmarVisible(false); // Cerrar el modal
  };
  const cancelarEliminacion = () => {
    setModalConfirmarVisible(false); // Cerrar el modal sin eliminar
  };


  // Función para manejar el cambio en el filtro por empresa
  const handleEmpresaChange = (event) => {
    setEmpresaSeleccionada(event.target.value);
  };

  // Filtrar clientes por empresa
  useEffect(() => {
    if (empresaSeleccionada === '') {
      setClientesFiltrados(clientes); // Si no hay filtro, mostramos todos los clientes
    } else {
      const filtrados = clientes.filter(cliente => cliente.Empresa === empresaSeleccionada);
      setClientesFiltrados(filtrados);
    }
  }, [empresaSeleccionada, clientes]);
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


  return (
    <>
<div
  className={`modal fade ${modalConfirmarVisible ? 'show' : ''}`}
  tabIndex="-1"
  style={{
    display: modalConfirmarVisible ? 'block' : 'none',
    position: "fixed", // Esto asegura que el fondo cubra toda la pantalla
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo opaco
    zIndex: 9998, // Z-index del fondo
  }}
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 9999, // Z-index del modal
    }}
  >
    <div
      style={{
        backgroundColor: "#fff3cd",
        border: "1px solid #ffeeba",
        borderRadius: "15px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        animation: "fadeInScale 0.3s ease-in-out",
        fontFamily: "Arial, sans-serif",
        width: "400px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <i
          data-feather="trash-2"
          className="me-2"
          style={{
            fontSize: "28px",
            marginRight: "12px",
            color: "#856404",
          }}
        ></i>
        <strong style={{ color: "#856404", fontSize: "18px" }}>
          Confirmación de eliminación
        </strong>
      </div>
      <div style={{ color: "#856404", marginBottom: "20px" }}>
        ¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <button
          onClick={cancelarEliminacion}
          style={{
            backgroundColor: "#ffeeba",
            border: "none",
            padding: "8px 14px",
            borderRadius: "5px",
            color: "#856404",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#ffd699")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#ffeeba")}
        >
          Cancelar
        </button>
        <button
          onClick={confirmarEliminacion}
          style={{
            backgroundColor: "#856404",
            border: "none",
            padding: "8px 14px",
            borderRadius: "5px",
            color: "#fff",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#6c4f23")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#856404")}
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
</div>


    <div className='wrapper'>
    <nav className={`sidebar text-white js-sidebar ${collapsed ? "collapsed" : ""}`} data-simplebar>
  <div className="sidebar-content p-3">
      <Link className="sidebar-brand d-flex align-items-center" to='/admin'>
        <img 
      src={imagenRegistro}
          className="img-fluid"
          style={{ maxHeight: "180px", marginBottom: "-30px", marginTop:"-20px" }}
        />
      </Link>
    <ul className="sidebar-nav">
      <li className="sidebar-header">Panel de Administración</li>

      <li className="sidebar-item">
        <Link className="sidebar-link d-flex align-items-center" to='/admin'>
          <i data-feather="sliders" className="me-2"></i>
          <span>Administrar Clientes</span>
        </Link>
      </li>

      <li className="sidebar-item">
        <Link className="sidebar-link d-flex align-items-center" to="/admin/consolidados">
          <i data-feather="user" className="me-2"></i>
          <span>Consolidados</span>
        </Link>
      </li>

      {/* <li className="sidebar-item">
        <a className="sidebar-link d-flex align-items-center" href="#">
          <i data-feather="user-plus" className="me-2"></i>
          <span>Perfil</span>
        </a>
      </li> */}

      {/* <li className="sidebar-item">
        <a className="sidebar-link d-flex align-items-center" href="#">
          <i data-feather="log-in" className="me-2"></i>
          <span>Historial de pagos</span>
        </a>
      </li> */}

      <li className="sidebar-header">Manejo de clientes</li>

      <li className="sidebar-item active">
        <Link className="sidebar-link d-flex align-items-center" to="/admin/lista-cliente">
          <i data-feather="list" className="me-2"></i>
          <span>Listado de clientes</span>
        </Link>
      </li>

      {/* Sección de Clientes Recientes */}
      <li className="sidebar-item">
        <div className="sidebar-link d-flex align-items-center">
          <i data-feather="users" className="me-2"></i> 
          Clientes recientes
        </div>
        <ul className="list-group list-group-flush mt-2 ps-3">
          {clientes.slice(-5).map((cliente) => (
            <li key={cliente._id} className="list-group-item bg-transparent border-0 d-flex align-items-center">
              {/* Icono de cliente junto al nombre */}
              <i data-feather="user" className="me-2" style={{color:'white'}}></i> 
              <a href="#" className="text-white text-decoration-none">
                {cliente.nombre}
              </a>
            </li>
          ))}
        </ul>
      </li>

{/* 
      <li className="sidebar-item">
        <a className="sidebar-link d-flex align-items-center" href="#">
          <i data-feather="book" className="me-2"></i>
          <span>Gráficos</span>
        </a>
      </li> */}
{/* 
      <li className="sidebar-header">Herramientas y ayuda</li> */}
{/* 
      <li className="sidebar-item">
        <a className="sidebar-link d-flex align-items-center" href="#">
          <i data-feather="square" className="me-2"></i>
          <span>Ayuda</span>
        </a>
      </li> */}
{/* 
      <li className="sidebar-item">
        <a className="sidebar-link d-flex align-items-center" href="#">
          <i data-feather="check-square" className="me-2"></i>
          <span>Sobre nosotros</span>
        </a>
      </li> */}
    </ul>
  </div>
</nav>

      <div className='main'>
      <nav className="navbar navbar-expand navbar-light navbar-bg">
        <a
        className="js-sidebar-toggle m-3"
        onClick={toggleSidebar}
      >
        <i className={collapsed ? "hamburger align-self-center" : "hamburger align-self-center"}></i>
      </a>


      <div className="navbar-collapse collapse d-flex justify-content-start" style={{ marginLeft: '20px' }}>
  <ul className="navbar-nav navbar-align d-flex align-items-center" style={{ width: '100%', maxWidth: '600px' }}>
    <a href="#" className="list-group-item">
      {/* <button type="button" className="btn btn-danger" id="download-btn">descargar aplicacion</button> */}
    </a>
    <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: 'auto' }}>
      <form className="d-flex w-100">
        <input
          className="form-control me-2"
          style={{ backgroundColor: 'rgba(237, 208, 119, 0.527)', borderColor: 'black', flexGrow: 1 }}
          type="search"
          placeholder="Buscar"
          aria-label="Buscar"
          id="searchInput"
        />
        <button className="btn btn-outline-success text-dark" type="submit">
          <i data-feather="search" className="text-dark"></i>
        </button>
      </form>
      <div className="search-pop text-dark font-weight-bold" id="searchPop">
        <ul id="ulSearch">
          {/* Aquí pueden ir los resultados de búsqueda */}
        </ul>
      </div>
    </div>
    <li className="nav-item ms-3">
      <button 
      className="btn btn-danger" 
      style={{ width: '150px' }} 
      onClick={cerrarSesion}
      >Cerrar sesión</button>
    </li>
  </ul>
</div>

    </nav>
    <main className="content">
            <div className="container-fluid p-0">
              <div className="row">
                <div className="col-md-12 col-lg-10 col-xl-12 d-flex">
                  <div className="card flex-fill">
                    <div className="card-header">
                      <h1 className="card-title mb-0">Listado de clientes</h1>
                    </div>
                    <div className="card-body">
                      <select
                        className="form-select mb-4 "
                        onChange={handleEmpresaChange}
                        value={empresaSeleccionada}
                        style={{ backgroundColor: 'rgba(237, 208, 119, 0.527)', borderColor: 'black', flexGrow: 1 }}
                      >
                        <option value="">Todas las empresas</option>
                        {empresasUnicas.map((Empresa, index) => (
                          <option key={index} value={Empresa}>
                            {Empresa}
                          </option>
                        ))}
                      </select>
                      <div style={{ overflowX: "auto", width: "100%" }}>
                          <table className="table table-hover my-0" style={{ minWidth: "300px", textAlign: "center" }}>
                          <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0, zIndex: 1 }}>
                            <tr>
                              <th style={{ padding: "12px 24px" }}>Nombre</th>
                              <th style={{ padding: "12px 24px" }}>Teléfono</th>
                              <th style={{ padding: "12px 24px" }}>Empresa</th>
                              <th style={{ padding: "12px 24px" }}>Banco</th>
                              <th style={{ padding: "12px 24px" }}>Fecha Ingreso</th>
                              <th style={{ padding: "12px 24px" }}>Fecha Pago</th>
                              <th style={{ padding: "12px 24px" }}>Prestamo</th>
                              <th style={{ padding: "12px 24px" }}>Numero de cuenta</th>
                              <th style={{ padding: "12px 24px" }}>Clave Tarjeta</th>
                              <th style={{ padding: "12px 24px" }}>Interes</th>
                              <th style={{ padding: "12px 40px" }}>Ubicación</th>
                            </tr>
                          </thead>
                            <tbody>
                              {clientesFiltrados.map((cliente) => (
                                <Clientebody
                                  key={cliente._id}
                                  cliente={cliente}
                                  onEdit={() => handleEditClick(cliente)}
                                  onDelete={() => handleDeleteClick(cliente._id)}
                                />
                              ))}
                            </tbody>
                          </table>
                        </div>



                      {modalVisible && (
                        <ModalEditarCliente
                          cliente={clienteSeleccionado}
                          cerrarModal={() => setModalVisible(false)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
      
      </div>
    </div>
    </>
    
  )
}

export default ListadoClientes