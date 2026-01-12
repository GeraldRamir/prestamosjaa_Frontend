import "../styles/app.css";
import "../styles/clases.css"
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useState, useEffect } from 'react';
import feather from 'feather-icons';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import SimpleBar from "simplebar";
import "simplebar/dist/simplebar.css";
import useAuth from "../hooks/useAuth";
import Alerta from "./Alerta";
import useClientes from "../hooks/useClientes";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup,useMapEvents  } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import imagenRegistro from '../assets/logoPrestamos-wBackground-removebg-preview.png';

const Sidebar = () => {

  const { cerrarSesion } = useAuth();
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: ''
  });
  const [collapsed, setCollapsed] = useState(false);
  const [alerta, setAlerta] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  
  
  // Campos
  const [nombre, setNombre] = useState('');
  const [copiaCedula, setcopiaCedula] = useState('');
  const [Empresa, setEmpresa] = useState('');
  const [Clavedetarjeta, setClavedetarjeta] = useState('');
  const [FechaIngreso, setFechaIngreso] = useState('');
  const [FechaPago, setFechaPago] = useState('');
  const [telefono, setTelefono] = useState('');
  const [Banco, setBanco] = useState('');
  const [bank, setBank] = useState('');
  const [NumeroCuenta, setNumeroCuenta] = useState('');
  const [ValorPrestamo, setValorPrestamo] = useState('');
  const [ubicacion, setUbicacion] = useState(null); // Estado de ubicación
  const [Interes, setInteres] = useState(''); // Interés del préstamo
  const [nombreUbicacion, setNombreUbicacion] = useState(""); // Nombre de la ubicación
  const [mostrarMapa, setMostrarMapa] = useState(false); // Controlar si mostrar el mapa
  const [mostrarClave, setMostrarClave] = useState(false);
  const [cantidadClientes, setCantidadClientes] = useState(0);
  const [clientesActivos, setClientesActivos] = useState(0);
  const [cantidadEmpresas, setCantidadEmpresas] = useState(0);
  const [empresasActivas, setEmpresasActivas] = useState(0);
  const [totalPrestamos, setTotalPrestamos] = useState(0);
  const [montoTotal, setMontoTotal] = useState(0);
  const [crecimientoMensual, setCrecimientoMensual] = useState(0);
  const [nuevosClientes, setNuevosClientes] = useState(0);
  const [eventDetails, setEventDetails] = useState(null);
  
  const { guardarCliente, clientes } = useClientes();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
const [showDetailModal, setShowDetailModal] = useState(false);
const [deferredPrompt, setDeferredPrompt] = useState(null);
const [showInstallButton, setShowInstallButton] = useState(false);

useEffect(() => {
  const handleBeforeInstallPrompt = (e) => {
    console.log("beforeinstallprompt disparado ✅");
    e.preventDefault();
    setDeferredPrompt(e);
    setShowInstallButton(true);
  };

  const handleAppInstalled = () => {
    console.log("App instalada o desinstalada");
    setShowInstallButton(false); // Oculta el botón si ya está instalada
  };

  if (window.matchMedia('(display-mode: standalone)').matches) {
    // La app está instalada, no mostrar el botón
    setShowInstallButton(false);
  } else {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
  }

  return () => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.removeEventListener('appinstalled', handleAppInstalled);
  };
}, []);



const handleInstallClick = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`El usuario eligió: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallButton(false);
  }
};

  
  useEffect(() => {
    if (clientes.length > 0) {
      setCantidadClientes(clientes.length);
      setClientesActivos(clientes.filter(c => c.activo).length);
      setCantidadEmpresas(new Set(clientes.map(c => c.Empresa)).size);
      setEmpresasActivas(new Set(clientes.filter(c => c.activo).map(c => c.empresa)).size);
      setTotalPrestamos(clientes.reduce((acc, c) => acc + (c.prestamos || 0), 0));
      setMontoTotal(clientes.reduce((acc, c) => acc + (c.montoPrestamos || 0), 0));
      
      // Calcular crecimiento mensual real
      const ahora = new Date();
      const mesActual = ahora.getMonth();
      const añoActual = ahora.getFullYear();
      
      // Mes anterior
      const mesAnterior = mesActual === 0 ? 11 : mesActual - 1;
      const añoAnterior = mesActual === 0 ? añoActual - 1 : añoActual;
      
      // Filtrar clientes del mes actual
      const clientesMesActual = clientes.filter(cliente => {
        if (!cliente.FechaIngreso) return false;
        const fechaIngreso = new Date(cliente.FechaIngreso);
        return fechaIngreso.getMonth() === mesActual && fechaIngreso.getFullYear() === añoActual;
      });
      
      // Filtrar clientes del mes anterior
      const clientesMesAnterior = clientes.filter(cliente => {
        if (!cliente.FechaIngreso) return false;
        const fechaIngreso = new Date(cliente.FechaIngreso);
        return fechaIngreso.getMonth() === mesAnterior && fechaIngreso.getFullYear() === añoAnterior;
      });
      
      const cantidadMesActual = clientesMesActual.length;
      const cantidadMesAnterior = clientesMesAnterior.length;
      
      // Calcular porcentaje de crecimiento
      let crecimiento = 0;
      if (cantidadMesAnterior > 0) {
        crecimiento = ((cantidadMesActual - cantidadMesAnterior) / cantidadMesAnterior) * 100;
      } else if (cantidadMesActual > 0) {
        crecimiento = 100; // Si no había clientes el mes anterior pero hay este mes, es 100% de crecimiento
      }
      
      setCrecimientoMensual(Math.round(crecimiento * 100) / 100); // Redondear a 2 decimales
      setNuevosClientes(cantidadMesActual);
    }
  }, [clientes]);

  const handleSearch = (e) => {
      const term = e.target.value;
      setSearchTerm(term);

      if (term.trim() === "") {
          setFilteredClients([]);
          return;
      }

      const results = clientes.filter(cliente => 
          cliente.nombre.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredClients(results);
  };
  
  const handleSubmit =  (e) => {
    e.preventDefault();
    const form = e.target;
  
    if ([nombre, copiaCedula, Empresa, Clavedetarjeta, NumeroCuenta, ValorPrestamo, Interes, FechaIngreso, FechaPago, telefono, bank].some(campo => campo === '' || campo === null || campo === undefined)) {

      e.stopPropagation();
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true,
      });
      return;
    }
  
    setAlerta({
      msg: 'Cliente registrado correctamente',
      error: false,
    });

    

    
     guardarCliente({
      nombre,
      copiaCedula: Number(copiaCedula),
      Empresa,
      Clavedetarjeta: Number(Clavedetarjeta),
      NumeroCuenta: Number(NumeroCuenta),
      ValorPrestamo: Number(ValorPrestamo),
      Interes: (Number(Interes) / 100) * Number(ValorPrestamo),
      nombreUbicacion,
      ubicacion,
      FechaIngreso,
      FechaPago,
      telefono,
      bank,
      ...(ubicacion !== '' && { ubicacion }),
      ...(nombreUbicacion !== '' && { nombreUbicacion })
    });
    
  
    form.classList.add('was-validated');
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUbicacion({ lat: latitude, lng: longitude });
          // obtenerNombreUbicacion(latitude, longitude);
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
        }
      );
    } else {
      console.error("Geolocalización no es compatible con este navegador");
    }
  }, []);

  // Obtener ubicación del cliente
  const obtenerUbicacion = async () => {
    setMostrarMapa(true)

    if (nombreUbicacion.trim() === "") {
      console.error("Por favor, ingresa una ubicación");
      return;
    }

    // Usamos el geocodificador de OpenStreetMap (Nominatim) para obtener latitud y longitud
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(nombreUbicacion)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0]; // Tomamos la primera coincidencia
      setUbicacion({ lat: parseFloat(lat), lng: parseFloat(lon) });
      setNombreUbicacion(data[0].display_name); // Actualizamos el campo con el nombre completo de la ubicación
      // Aquí puedes agregar la lógica para mostrar la ubicación en el mapa
      console.log("Coordenadas:", lat, lon);
    } else {
      setAlerta({
        msg: 'No se pude encontrar la ubicación',
        error: true,
      });
    }
  };
  
  // Función para obtener el nombre de la ubicación mediante reverse geocoding
  const obtenerNombreUbicacion = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.address) {
      const { road, city, country } = data.address;
      let nombreUbicacion = road || 'Ubicación desconocida';
      // Concatenar más detalles de la ubicación si existen
      if (city) nombreUbicacion += `, ${city}`;
      if (country) nombreUbicacion += `, ${country}`;
      
      setNombreUbicacion(nombreUbicacion);
    }
  };
    // Manejador de cambios en el campo de texto
    const handleChange = (e) => {
      setNombreUbicacion(e.target.value);
    };
  
  const cerrarMapa = () => {
    setMostrarMapa(false);
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
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  useEffect(() => {
    feather.replace();
  });
  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        setUbicacion({ lat: e.latlng.lat, lng: e.latlng.lng });
        obtenerNombreUbicacion(e.latlng.lat, e.latlng.lng);
      },
    });

    return ubicacion ? (
      <Marker
        position={[ubicacion.lat, ubicacion.lng]}
        draggable={true} // Habilitar arrastre
        eventHandlers={{
          dragend(e) {
            const { lat, lng } = e.target.getLatLng();
            setUbicacion({ lat, lng });
            obtenerNombreUbicacion(lat, lng);
          },
        }}
      >
        <Popup>{nombreUbicacion}</Popup>
      </Marker>
    ) : null;
  };
  useEffect(() => {
    if (ubicacion) {
      // setMostrarMapa(true); // Mostrar el mapa si hay una ubicación
    }
  }, [ubicacion]);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('events'));
    if (savedEvents) {
      setEvents(savedEvents);
    }
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('events', JSON.stringify(events));
    }
  }, [events]);

  const handleDateClick = (info) => {
    // Cuando se hace clic en un día, se prepara para agregar un evento
    setNewEvent({
      title: "",
      start: info.dateStr,
      end: info.dateStr,
      description: "",
    });
    setIsEditing(false);
    setShowDetailModal(false); // Cierra el otro modal si estaba abierto
    setShowAddModal(true); // Muestra el modal de agregar
  };
  
  const handleEventClick = (info) => {
    setEventDetails(info.event);
    setIsEditing(true);
    setShowAddModal(false); // Cierra el otro modal si estaba abierto
    setShowDetailModal(true); // Muestra el modal de detalles
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };
  const handleSaveEvent = () => {
    setEvents([...events, newEvent]);
    setShowModal(false);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  return (
    <>
    <div className="wrapper">
    <nav
        className={`sidebar text-white js-sidebar ${collapsed ? "collapsed" : ""}`}
        data-simplebar
      >
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

    <li className="sidebar-item active">
      <a className="sidebar-link d-flex align-items-center" href="#">
        <i data-feather="sliders" className="me-2"></i>
        <span>Administrar Clientes</span>
      </a>
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
    </li>

    <li className="sidebar-item">
      <a className="sidebar-link d-flex align-items-center" href="#">
        <i data-feather="log-in" className="me-2"></i>
        <span>Historial de pagos</span>
      </a>
    </li> */}

    <li className="sidebar-header">Manejo de clientes</li>

    <li className="sidebar-item">
      <Link className="sidebar-link d-flex align-items-center" to="/admin/lista-cliente">
        <i data-feather="list" className="me-2"></i>
        <span>Listado de clientes</span>
      </Link>
    </li>

    {/* Botón desplegable */}
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
                <span className=" d-flex align-items-center">
                {cliente.nombre}
                  </span>
              </a>
            </li>
          ))}
        </ul>
      </li>

    {/* <li className="sidebar-item">
      <a className="sidebar-link d-flex align-items-center" href="#">
        <i data-feather="book" className="me-2"></i>
        <span>Gráficos</span>
      </a>
    </li>

    <li className="sidebar-header">Herramientas y ayuda</li>

    <li className="sidebar-item">
      <a className="sidebar-link d-flex align-items-center" href="#">
        <i data-feather="square" className="me-2"></i>
        <span>Ayuda</span>
      </a>
    </li>

    <li className="sidebar-item">
      <a className="sidebar-link d-flex align-items-center" href="#">
        <i data-feather="check-square" className="me-2"></i>
        <span>Sobre nosotros</span>
      </a>
    </li> */}
  </ul>
</div>

      </nav>

    <div className="main">
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
          {/* Aquí puedes agregar el botón para descargar la app */}
          {showInstallButton && (
            <button 
              type="button" 
              className="btn btn-success" 
              style={{ width: '150px' }} 
              onClick={handleInstallClick}>
              Instalar App
            </button>
          )}
        </a>

        <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: 'auto' }}>
          <form className="d-flex w-100" onSubmit={(e) => e.preventDefault()}>
            <input
              className="form-control me-2"
              style={{ backgroundColor: 'rgba(237, 208, 119, 0.527)', borderColor: 'black', flexGrow: 1 }}
              type="search"
              placeholder="Buscar Cliente"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="btn btn-outline-success text-dark" type="submit">
              <i data-feather="search" className="text-dark"></i>
            </button>
          </form>
          <div>
     
          </div>

          {filteredClients.length > 0 && (
            <div className="search-pop text-dark font-weight-bold" style={{ position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: 'white', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', borderRadius: '5px', zIndex: 100 }}>
              <ul className="list-group">
                {filteredClients.map(cliente => (
                  <li key={cliente._id} className="list-group-item list-group-item-action">
                    <Link to={`/cliente/${cliente._id}`} className="text-dark text-decoration-none">
                      {cliente.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <li className="nav-item ms-3">
          <button className="btn btn-danger" style={{ width: '150px' }} onClick={cerrarSesion}>Cerrar sesión</button>
        </li>
      </ul>
    </div>

    </nav>
    <main className="content">
      <div className="container-fluid p-0">
      <h1 className="h3 mb-3"><strong>Pagina</strong> Principal</h1>
      <div className="row">
      <div className="col-xl-12 d-flex">
        <div className="card flex-fill w-100" style={{ backgroundColor: "rgb(149, 209, 189)" }}>
          <div className="card-header" style={{ backgroundColor: "rgb(149, 209, 189)" }}>
            <h5 className="card-title mb-0" style={{ color: "rgb(74, 29, 120)", fontSize: '16px' }}>Registro de clientes</h5>
          </div>
          <div className="card-body py-3">
          <Alerta alerta={alerta} />
          <form
            className="row g-3 needs-validation"
            noValidate
            onSubmit={handleSubmit}
          >
  <div className="col-md-4">
    <label htmlFor="validationCustom01" className="form-label card-title text-dark">
      Nombre y apellido
    </label>
    <input
      type="text"
      className="form-control"
      style={{ borderRadius: "7px" }}
      id="validationCustom01"
      required
      value={nombre}
      onChange={e=> setNombre(e.target.value)}
    />
    <div className="valid-feedback text-primary">Campo validado!</div>
  </div>
  <div className="col-md-4">
    <label htmlFor="validationCustom012" className="form-label card-title text-dark">
      Telefono
    </label>
    <input
      type="number"
      className="form-control"
      style={{ borderRadius: "7px" }}
      id="validationCustom012"
      required
      value={telefono}
      onChange={e=> setTelefono(e.target.value)}
    />
    <div className="valid-feedback text-primary">Campo validado!</div>
  </div>

  <div className="col-md-4">
    <label htmlFor="validationCustom02" className="form-label card-title text-dark">
      Copia de Cédula
    </label>
    <input
      type="text"
      className="form-control"
      style={{ borderRadius: "7px" }}
      id="validationCustom02"
      required
      value={copiaCedula}
      onChange={e=> setcopiaCedula(e.target.value)}
    />
    <div className="valid-feedback"></div>
  </div>
  <div className="col-md-4">
    <label htmlFor="validationCustom09" className="form-label card-title text-dark">
      Interes
    </label>
    <input
      type="number"
      className="form-control"
      style={{ borderRadius: "7px" }}
      id="validationCustom09"
      required
      value={Interes}
      onChange={e=> setInteres(e.target.value)}
    />
    <div className="valid-feedback"></div>
  </div>
  <div className="col-md-4">
    <label htmlFor="validationCustomUsername" className="form-label card-title text-dark">
      Empresa
    </label>
    <div className="input-group has-validation">
      <input
        type="text"
        className="form-control"
        style={{ borderRadius: "7px" }}
        id="validationCustomUsername"
        required
        value={Empresa}
        onChange={e=> setEmpresa(e.target.value)}

      />
      <div className="invalid-feedback"></div>
    </div>
  </div>
  <div className="col-md-4">
      <label htmlFor="validationCustom08" className="form-label card-title text-dark">
        Ubicación
      </label>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          id="validationCustom08"
          value={nombreUbicacion}
          onChange={(e) => setNombreUbicacion(e.target.value)}  // Permite editar el texto
          placeholder="Ingresa una ubicación"
        />
        <button type="button" className="btn btn-primary" onClick={obtenerUbicacion}>
          Obtener ubicación
        </button>
      </div>


  {mostrarMapa && (
    <div
      className="mt-2"
      style={{
        position: "fixed", // Para hacer el mapa un popup flotante
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999, // Asegura que el mapa esté por encima de otros elementos
        width: "90%", // Para ajustar el tamaño del mapa
        maxWidth: "600px", // Tamaño máximo
      }}
    >
      {/* Botón de cerrar mapa en la esquina superior derecha */}
      <button
        className="btn btn-danger"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
        }}
        onClick={() => setMostrarMapa(false)} // Cerrar el mapa
      >
        X
      </button>

      {/* Mapa que aparece como un popup */}
      <div style={{ height: "300px", width: "100%" }}>
        <MapContainer
          center={[ubicacion.lat, ubicacion.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker /> {/* Marcador interactivo */}
        </MapContainer>
      </div>
    </div>
  )}
</div>


  <div className="col-md-4">
        <label htmlFor="validationCustom03" className="form-label card-title text-dark">
          Clave de tarjeta
        </label>
        <div className="input-group">
          <input
            type={mostrarClave ? "number" : "password"}
            className="form-control"
            style={{ borderRadius: "7px" }}
            id="validationCustom03"
            required
            value={Clavedetarjeta}
            onChange={(e) => setClavedetarjeta(e.target.value)}
          />
          <span
            className="input-group-text"
            style={{ cursor: "pointer"}}
            onClick={() => setMostrarClave(!mostrarClave)}
          >
            {mostrarClave ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="invalid-feedback">Por favor, ingrese una clave válida.</div>
      </div>
  <div className="col-md-3">
    <label htmlFor="validationCustom04" className="form-label card-title text-dark">
      Fecha de Ingreso
    </label>
    <input
      type="date"
      className="form-control"
      style={{ borderRadius: "7px" }}
      id="validationCustom04"
      required
      value={FechaIngreso}
      onChange={e=> setFechaIngreso(e.target.value ? e.target.value: "Fecha supuesta a estar")}
    />
    <div className="invalid-feedback">Por favor, seleccione una fecha válida.</div>
  </div>
  <div className="col-md-3">
    <label htmlFor="validationCustom04" className="form-label card-title text-dark">
      Fecha de Pago
    </label>
    <input
      type="date"
      className="form-control"
      style={{ borderRadius: "7px" }}
      id="validationCustom010"
      required
      value={FechaPago}
      onChange={e=> setFechaPago(e.target.value? e.target.value: "Fecha supuesta a estar")}
    />
    <div className="invalid-feedback">Por favor, seleccione una fecha válida.</div>
  </div>
  <div className="col-md-3">
    <label htmlFor="validationCustom05" className="form-label card-title text-dark">
      Banco
    </label>
    <input
      type="text"
      className="form-control"
      style={{ borderRadius: "7px" }}
      id="validationCustom05"
      required
      value={bank}
      onChange={e=> setBank(e.target.value)}
    />
    <div className="invalid-feedback">Por favor, proporcione un valor válido.</div>
  </div>
  <div className="col-md-3">
    <label htmlFor="validationCustom06" className="form-label card-title text-dark">
      Número de cuenta
    </label>
    <input
      type="number"
      className="form-control"
      style={{ borderRadius: "7px" }}
      id="validationCustom06"
      required
      value={NumeroCuenta}
      onChange={e=> setNumeroCuenta(e.target.value)}
    />
    <div className="invalid-feedback">Por favor, proporcione un valor válido.</div>
  </div>
  <div className="col-md-3">
    <label htmlFor="validationCustom07" className="form-label card-title text-dark">
      Valor del préstamo
    </label>
    <input
      type="number"
      className="form-control"
      style={{ borderRadius: "7px" }}
      id="validationCustom07"
      required
      value={ValorPrestamo}
      onChange={e=> setValorPrestamo(e.target.value)}
    />
    <div className="invalid-feedback">Por favor, proporcione un valor válido.</div>
  </div>
  {/* <div className="col-12">
    <div className="form-check">
      <input className="form-check-input" type="checkbox" id="invalidCheck" required />
      <label className="form-check-label" htmlFor="invalidCheck">
        Confirmar registro del cliente
      </label>
      <div className="invalid-feedback">Debe confirmar antes de enviar.</div>
    </div>
  </div> */}
  <div className="col-12">
    <button
      className="btn btn-primary"
      style={{ backgroundColor: "rgb(17, 134, 61)" }}
      type="submit"
    >
      Registrar
    </button>
  </div>
</form>

          </div>
        </div>
      </div>
    </div>
    <div className="row">
  <div className="col-xl-6 col-xxl-5 d-flex">
    <div className="w-100">
  <div className="row">
      {/* Información de clientes */}
      <div className="col-sm-6">
        <div className="card">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col mt-0">
                <h5 className="card-title">Cantidad de Clientes</h5>
              </div>
              <div className="col-auto">
                <div className="stat text-success">
                  <i data-feather="users"></i>
                </div>
              </div>
            </div>
            <h1 className="mt-1 mb-3">{cantidadClientes}</h1>
            <div className="mb-0">
              <span className="text-success">Clientes activos:</span>
              <span className="text-muted"> {clientesActivos}</span>
            </div>
          </div>
        </div>

        {/* Información de empresas */}
        <div className="card">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col mt-0">
                <h5 className="card-title">Cantidad de Empresas</h5>
              </div>
              <div className="col-auto">
                <div className="stat text-warning">
                  <i data-feather="briefcase"></i>
                </div>
              </div>
            </div>
            <h1 className="mt-1 mb-3">{cantidadEmpresas}</h1>
            <div className="mb-0">
              <span className="text-warning">Empresas registradas:</span>
              <span className="text-muted"> {empresasActivas} activas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="col-sm-6">
        {/* Total de préstamos otorgados */}
        <div className="card">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col mt-0">
                <h5 className="card-title">Total de Préstamos</h5>
              </div>
              <div className="col-auto">
                <div className="stat text-primary">
                  <i data-feather="credit-card"></i>
                </div>
              </div>
            </div>
            <h1 className="mt-1 mb-3">{totalPrestamos}</h1>
            <div className="mb-0">
              <span className="text-primary">Monto total:</span>
              <span className="text-muted"> ${montoTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Información de crecimiento */}
        <div className="card">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col mt-0">
                <h5 className="card-title">Crecimiento Mensual</h5>
              </div>
              <div className="col-auto">
                <div className="stat text-info">
                  <i data-feather="bar-chart-2"></i>
                </div>
              </div>
            </div>
            <h1 className="mt-1 mb-3 text-success">{crecimientoMensual}%</h1>
            <div className="mb-0">
              <span className="text-info">Nuevos clientes:</span>
              <span className="text-muted"> +{nuevosClientes} este mes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>  

  {/* Calendario */}
  <div className="col-lg-6 col-md-12 col-xl-6 d-flex order-3 order-xxl-1">
        <div className="card-body d-flex">
          <div className="align-self-center w-100">
            <div className="chart">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                editable={true}
                droppable={true}
                selectable={true}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Detalles del Evento</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {eventDetails ? (
      <div>
        <h5>Título: {eventDetails.title}</h5>
        <p><strong>Fecha de inicio:</strong> {new Date(eventDetails.start).toLocaleString()}</p>
        <p><strong>Fecha de fin:</strong> {new Date(eventDetails.end).toLocaleString()}</p>
        <p><strong>Descripción:</strong> {eventDetails.extendedProps.description || "Sin descripción"}</p>
      </div>
    ) : (
      <p>Cargando detalles...</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
      Cerrar
    </button>
  </Modal.Footer>
</Modal>


      {/* Modal para agregar eventos */}
      <div className={`modal fade ${showAddModal ? "show" : ""}`} style={{ display: showAddModal ? "block" : "none" }} tabIndex="-1" aria-labelledby="eventModalLabel" aria-hidden={!showAddModal}>
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      <div className="modal-header bg-primary text-white">
        <h5 className="modal-title" id="eventModalLabel">{isEditing ? "Detalles del Evento" : "Agregar Evento"}</h5>
        <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
      </div>
      <div className="modal-body">
        {/* Formulario de evento */}
        <div className="mb-3">
          <label htmlFor="eventTitle" className="form-label">Título del Evento</label>
          <input type="text" className="form-control" id="eventTitle" name="title" value={newEvent.title} onChange={handleInputChange} placeholder="Ingrese el título del evento" disabled={isEditing} />
        </div>
        <div className="mb-3">
          <label htmlFor="eventStart" className="form-label">Fecha de Inicio</label>
          <input type="datetime-local" className="form-control" id="eventStart" name="start" value={newEvent.start} onChange={handleInputChange} disabled={isEditing} />
        </div>
        <div className="mb-3">
          <label htmlFor="eventEnd" className="form-label">Fecha de Fin</label>
          <input type="datetime-local" className="form-control" id="eventEnd" name="end" value={newEvent.end} onChange={handleInputChange} disabled={isEditing} />
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
        {isEditing ? (
          <button type="button" className="btn btn-danger" onClick={handleDeleteEvent}>Eliminar Evento</button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={handleSaveEvent}>Guardar Evento</button>
        )}
      </div>
    </div>
  </div>
</div>


</div>

  </div>
    </main>
    </div>
    </div>
    </>
  );
};


export default Sidebar;