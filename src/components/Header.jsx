import "../styles/app.css";
import "../styles/clases.css"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useState, useEffect } from 'react';
import feather from 'feather-icons';
import "simplebar/dist/simplebar.css"; // Asegúrate de importar los estilos de simplebar
import useAuth from "../hooks/useAuth";
import Alerta from "./Alerta";
import useClientes from "../hooks/useClientes";
import SimpleBar from 'simplebar-react';


const Header = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

    const {cerrarSesion}=useAuth()

  return (
    <>
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

    </>
  
  );
};

export default Header;
