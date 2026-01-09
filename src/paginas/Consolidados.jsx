import { FaPrint } from "react-icons/fa";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import "../styles/app.css";
import "../styles/clases.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import feather from 'feather-icons';
import SimpleBar from "simplebar";
// import "simplebar/dist/simplebar.css"; 
import useAuth from "../hooks/useAuth";
import useClientes from "../hooks/useClientes";
import { Link } from "react-router-dom";
import { useContext } from "react";
import PagosContext from "../context/PagosProvider";
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';  // Importación de los estilos de Handsontable
import imagenRegistro from '../assets/logoPrestamos-wBackground-removebg-preview.png';

const Consolidados = () => {
  const { clientes } = useClientes();
  const { pagos, obtenerPagos } = useContext(PagosContext);
  const [collapsed, setCollapsed] = useState(false);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  const { cerrarSesion } = useAuth();
  const tableRef = useRef(null);
  const [clientesFiltrados, setClientesFiltrados] = useState(clientes);

    useEffect(() => {
      feather.replace();
    });

  useEffect(() => {
    // Verificar si clientes está correctamente cargado
    console.log("Clientes antes del filtro:", clientes);
    
    if (empresaSeleccionada === '') {
      console.log("No se seleccionó empresa, mostrando todos los clientes");
      setClientesFiltrados(clientes);
    } else {
      // Filtrar clientes por empresa seleccionada
      const clientesFiltradosPorEmpresa = clientes.filter(cliente => cliente.Empresa === empresaSeleccionada);
      console.log("Clientes filtrados por empresa:", clientesFiltradosPorEmpresa);
      setClientesFiltrados(clientesFiltradosPorEmpresa);
    }
  }, [empresaSeleccionada, clientes]); // Dependencias de empresaSeleccionada y clientes
  
  

  const obtenerEmpresasUnicas = () => {
    const empresas = clientes.map(cliente => cliente.Empresa);
    return [...new Set(empresas)];
  };

  const empresasUnicas = useMemo(() => obtenerEmpresasUnicas(), [clientes]);

  useEffect(() => {
    obtenerPagos(); // Obtener los pagos cuando el componente se monte
  }, [obtenerPagos]);


  const generarDatosTabla = async () => {
    try {
      const datos = [];
  
      for (const cliente of clientesFiltrados) {
        try {
          // Llamar a obtenerPagos para cada cliente
          const pagosCliente = await obtenerPagos(cliente._id);
  
          if (!pagosCliente || !pagosCliente.totales) {
            console.warn(`No se encontraron pagos para el cliente ${cliente.nombre}`);
            datos.push([
              cliente.Empresa,
              cliente.nombre,
              0, 0, 0, 0, 0, 0
            ]); // Valores predeterminados si no se encontraron pagos
          } else {
            // Verificar los pagos
            console.log(`Pagos recibidos para ${cliente.nombre}:`, pagosCliente);
datos.push([
  cliente.Empresa,
  cliente.nombre,
  cliente.Clavedetarjeta ?? "",
  cliente.ValorPrestamo ?? 0,
  pagosCliente.totales.capital ?? 0,
  pagosCliente.totales.avance ?? 0,
  pagosCliente.totales.abono ?? 0,
  pagosCliente.totales.intereses ?? 0,
  pagosCliente.totales.atrasos ?? 0,
  pagosCliente.totales.descuento ?? 0   // ✅ Asegúrate de que sea "descuento", no "descuent"
]);

          }
        } catch (error) {
          console.error(`Error al obtener pagos para el cliente ${cliente.nombre}:`, error);
          datos.push([
            cliente.Empresa,
            cliente.nombre,
            cliente.Clavetarjeta,
            0, 0, 0, 0, 0, 0
          ]);
        }
      }
  
      console.log("Datos generados para la tabla:", datos);
      return datos;
    } catch (error) {
      console.error("Error al generar los datos de la tabla:", error);
      return [];
    }
  };
  
  

useEffect(() => {
  let hotInstance;

  if (clientesFiltrados.length > 0 && tableRef.current) {
    generarDatosTabla().then((data) => {
      if (data && data.length > 0) {
        if (tableRef.current.firstChild) {
          tableRef.current.innerHTML = ""; // 🔁 Limpiar DOM para evitar instancias duplicadas
        }

        hotInstance = new Handsontable(tableRef.current, {
          data,
          colHeaders: [
            "Empresa", 
            "Nombre del Cliente", 
            "Clave de tarjeta",
            "Valor del préstamo",
            "Capital", 
            "Avance", 
            "Abono", 
            "Intereses quincenales", 
            "Atrasos",
            "Descuento" // ✅ Nueva columna
          ],
          rowHeaders: true,
          filters: true,
          dropdownMenu: true,
          contextMenu: true,
          width: '100%',
          height: 'auto',
          stretchH: 'all',
          licenseKey: 'non-commercial-and-evaluation'
        });
      }
    }).catch((error) => {
      console.error("Error al generar la tabla:", error);
    });
  }

  return () => {
    if (hotInstance) {
      hotInstance.destroy(); // 🔴 Destruye instancia anterior al desmontar
    }
  };
}, [clientesFiltrados]);

  

  const handlePrintHandsontable = async () => {
    try {
      const data = await generarDatosTabla(); // Espera los datos antes de continuar
      const empresaActual = clientesFiltrados.length > 0 ? clientesFiltrados[0].Empresa : 'Ninguna';
  
      if (!data || data.length === 0) {
        console.error("No hay datos para imprimir.");
        return;
      }
  
      let tableHTML = "<table border='1' style='border-collapse: collapse; width: 100%;'>";
      tableHTML += "<thead><tr>";
const colHeaders = [
  "Empresa", "Nombre del Cliente", "Clave de tarjeta", "Valor del préstamo",
  "Capital", "Avance", "Abono", "Intereses quincenales", "Atrasos", "Descuento" // ← Aquí
];

  
      colHeaders.forEach(header => {
        tableHTML += `<th style='padding: 8px; text-align: left; background-color: #f2f2f2;'>${header}</th>`;
      });
      tableHTML += "</tr></thead><tbody>";
  
      data.forEach(row => {
        tableHTML += "<tr>";
        row.forEach(cell => {
          tableHTML += `<td style='padding: 8px; text-align: left;'>${cell !== undefined ? cell : ''}</td>`;
        });
        tableHTML += "</tr>";
      });
  
      tableHTML += "</tbody></table>";
  
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>CONSOLIDADO DE LA EMPRESA__________${empresaActual}__________</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              ${tableHTML}
              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        console.error("No se pudo abrir la ventana para imprimir.");
      }
    } catch (error) {
      console.error("Error al imprimir la tabla:", error);
    }
  };
  

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
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
            <li className="sidebar-item active">
              <a className="sidebar-link d-flex align-items-center" href="#">
                <i data-feather="user" className="me-2"></i>
                <span>Consolidados</span>
              </a>
            </li>
            <li className="sidebar-header">Manejo de clientes</li>
            <li className="sidebar-item">
              <Link className="sidebar-link d-flex align-items-center" to="/admin/lista-cliente">
                <i data-feather="cloud-lightning" className="me-2"></i>
                <span>Listado de clientes</span>
              </Link>
            </li>
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
          </ul>
        </div>
      </nav>

      <div className='main'>
        <nav className="navbar navbar-expand navbar-light navbar-bg">
          <a className="js-sidebar-toggle m-3" onClick={toggleSidebar}>
            <i className={collapsed ? "hamburger align-self-center" : "hamburger align-self-center"}></i>
          </a>

          <div className="navbar-collapse collapse d-flex justify-content-start" style={{ marginLeft: '20px' }}>
            <ul className="navbar-nav navbar-align d-flex align-items-center" style={{ width: '100%', maxWidth: '600px' }}>
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
              </div>
              <li className="nav-item ms-3">
                <button 
                  className="btn btn-danger" 
                  style={{ width: '150px' }} 
                  onClick={cerrarSesion}
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <main className="content">
          <div className="container-fluid p-0">
            <div className="row">
              <div className="col-md-12 col-lg-10 col-xl-12 d-flex">
                <div className="card flex-fill">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h1 className="card-title mb-0">Listado de clientes</h1>
                    <button onClick={handlePrintHandsontable} className="btn btn-primary d-flex align-items-center gap-2">
                      <FaPrint /> Imprimir
                    </button>
                  </div>
                  <div className="card-body">
                    {/* Filtro por empresa */}
                    <select
                      className="form-select mb-4"
                      style={{ backgroundColor: 'rgba(237, 208, 119, 0.527)', borderColor: 'black', flexGrow: 1 }}
                      onChange={(e) => setEmpresaSeleccionada(e.target.value)}
                      value={empresaSeleccionada}
                    >
                      <option value="">Todas las empresas</option>
                      {empresasUnicas.map((empresa, index) => (
                        <option key={index} value={empresa}>{empresa}</option>
                      ))}
                    </select>
<div style={{ overflowX: "auto", maxWidth: "100%" }}>
  <div ref={tableRef}></div>
</div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Consolidados;
