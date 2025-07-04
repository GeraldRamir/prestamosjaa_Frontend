import React from 'react'
import SimpleBar from 'simplebar-react';
import "simplebar/dist/simplebar.css"; // Asegúrate de importar los estilos de simplebar
import useAuth from "../hooks/useAuth";
import Alerta from "./Alerta";
import useClientes from "../hooks/useClientes";
import { Link } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from 'react';
import feather from 'feather-icons';

const Main = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
    const [collapsed, setCollapsed] = useState(false);
    const [alerta, setAlerta] = useState({});
    // Campos
    const [nombre, setNombre]= useState('')
    const [copiaCedula, setcopiaCedula]= useState('')
    const [Empresa, setEmpresa]= useState('')
    const [ClaveTarjeta, setClaveTarjeta]= useState('')
    const [Fecha, setFecha]= useState('')
    const [Banco, setBanco]= useState('')
    const [NumeroCuenta, setNumeroCuenta]= useState('')
    const [ValorPrestamo, setValorPrestamo]= useState('')
    const {guardarCliente}= useClientes()


    const handleSubmit= e=>{
      e.preventDefault();
      const form = e.target;
  
      if ([nombre, copiaCedula, Empresa, ClaveTarjeta, Fecha, Banco, NumeroCuenta,ValorPrestamo].includes('')) {
        e.stopPropagation();
        setAlerta({
          msg:'Todos los campos son obligatorios',
          error:true
        })
        return
      } 
        // Aquí va lo que quieres hacer si el formulario es válido
        setAlerta({
          msg:'Cliente registrado correctamente',
          error:false
        })
      
        guardarCliente({nombre, copiaCedula, Empresa, ClaveTarjeta, Fecha, Banco, NumeroCuenta,ValorPrestamo})
      
     
      form.classList.add('was-validated');
    }
  
    useEffect(() => {
      // Inicializa SimpleBar y el colapso del sidebar
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
  
  
    const handleDateClick = (info) => {
      setNewEvent({ ...newEvent, start: info.dateStr, end: info.dateStr });
      setShowModal(true);
    };
  
    const handleEventClick = (info) => {
      alert(`Evento: ${info.event.title}`);
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewEvent({ ...newEvent, [name]: value });
    };
  
    const handleSaveEvent = () => {
      if (newEvent.title && newEvent.start && newEvent.end) {
        setEvents([...events, newEvent]);
        setShowModal(false);
        setNewEvent({ title: "", start: "", end: "" });
      } else {
        alert("Por favor complete todos los campos.");
      }
    };
  
    useEffect(() => {
      feather.replace(); // Reemplazar íconos de Feather después del renderizado
    });
  return (
    
    <>
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
    <label htmlFor="validationCustom02" className="form-label card-title text-dark">
      Copia Cédula
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
  <div className="col-md-6">
    <label htmlFor="validationCustom03" className="form-label card-title text-dark">
      Clave de tarjeta
    </label>
    <input
      type="text"
      className="form-control"
      style={{ borderRadius: "7px" }}
      id="validationCustom03"
      required
      value={ClaveTarjeta}
      onChange={e=> setClaveTarjeta(e.target.value)}
      
    />
    <div className="invalid-feedback">Por favor, ingrese una clave válida.</div>
  </div>
  <div className="col-md-3">
    <label htmlFor="validationCustom04" className="form-label card-title text-dark">
      Fecha
    </label>
    <input
      type="date"
      className="form-control"
      style={{ borderRadius: "7px" }}
      id="validationCustom04"
      required
      value={Fecha}
      onChange={e=> setFecha(e.target.value)}
    />
    <div className="invalid-feedback">Por favor, seleccione una fecha válida.</div>
  </div>
  <div className="col-md-3">
    <label htmlFor="validationCustom05" className="form-label card-title text-dark">
      Banco
    </label>
    <input
      type="tel"
      className="form-control"
      style={{ borderRadius: "7px" }}
      id="validationCustom05"
      required
      value={Banco}
      onChange={e=> setBanco(e.target.value)}
    />
    <div className="invalid-feedback">Por favor, proporcione un valor válido.</div>
  </div>
  <div className="col-md-3">
    <label htmlFor="validationCustom06" className="form-label card-title text-dark">
      Número de cuenta
    </label>
    <input
      type="tel"
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
      type="text"
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
        {/* Información de préstamos activos */}
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col mt-0">
                  <h5 className="card-title">Préstamos Activos</h5>
                </div>
                <div className="col-auto">
                  <div className="stat text-success">
                    <i data-feather="dollar-sign"></i>
                  </div>
                </div>
              </div>
              <h1 className="mt-1 mb-3">45</h1>
              <div className="mb-0">
                <span className="text-success">Total en curso:</span>
                <span className="text-muted"> $250,000</span>
              </div>
            </div>
          </div>

          {/* Información de solicitudes pendientes */}
          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col mt-0">
                  <h5 className="card-title">Solicitudes Pendientes</h5>
                </div>
                <div className="col-auto">
                  <div className="stat text-warning">
                    <i data-feather="clock"></i>
                  </div>
                </div>
              </div>
              <h1 className="mt-1 mb-3">12</h1>
              <div className="mb-0">
                <span className="text-warning">Revisión en proceso:</span>
                <span className="text-muted"> 6 en las últimas 24 horas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="col-sm-6">
          {/* Préstamos completados */}
          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col mt-0">
                  <h5 className="card-title">Préstamos Completados</h5>
                </div>
                <div className="col-auto">
                  <div className="stat text-primary">
                    <i data-feather="check-circle"></i>
                  </div>
                </div>
              </div>
              <h1 className="mt-1 mb-3">98</h1>
              <div className="mb-0">
                <span className="text-primary">Monto total:</span>
                <span className="text-muted"> $500,000</span>
              </div>
            </div>
          </div>

          {/* Tasa de aprobación */}
          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col mt-0">
                  <h5 className="card-title">Tasa de Aprobación</h5>
                </div>
                <div className="col-auto">
                  <div className="stat text-info">
                    <i data-feather="trending-up"></i>
                  </div>
                </div>
              </div>
              <h1 className="mt-1 mb-3 text-success">85%</h1>
              <div className="mb-0">
                <span className="text-info">Clientes satisfechos:</span>
                <span className="text-muted"> 450+ en total</span>
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

      {/* Modal para agregar eventos */}
      <div className={`modal fade ${showModal ? "show" : ""}`} style={{ display: showModal ? "block" : "none" }} tabIndex="-1" aria-labelledby="eventModalLabel" aria-hidden={!showModal}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="eventModalLabel">Agregar Evento</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="eventTitle" className="form-label">Título del Evento</label>
                <input
                  type="text"
                  className="form-control"
                  id="eventTitle"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  placeholder="Ingrese el título del evento"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="eventStart" className="form-label">Fecha de Inicio</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="eventStart"
                  name="start"
                  value={newEvent.start}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="eventEnd" className="form-label">Fecha de Fin</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="eventEnd"
                  name="end"
                  value={newEvent.end}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSaveEvent}>
                Guardar Evento
              </button>
            </div>
          </div>
        </div>
      </div>
</div>

  </div>
    </main>
    </>
  )
}

export default Main