import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // Asegúrate de tener estos imports si no están
import L from 'leaflet'; // Asegúrate de importar Leaflet

const Mapa = ({ mostrarMapa, ubicacionMapa, setMostrarMapa }) => {
  if (!mostrarMapa || ubicacionMapa.lat === null || ubicacionMapa.lng === null) return null;

  return (
    <>
      {/* Estilo aplicado directamente a la capa del mapa */}
      <section
        style={{
          position: 'fixed',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          width: '90%', // Ajustar el ancho al 90% del ancho de la pantalla
        }}
      >
        <button
          className="btn btn-danger"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1001,
          }}
          onClick={() => setMostrarMapa(false)} // Cerrar el mapa
        >
          X
        </button>

        {/* MapContainer se mantiene para el mapa */}
        <MapContainer
          center={[ubicacionMapa.lat, ubicacionMapa.lng]}
          zoom={13}
          style={{ height: '300px', width: '100%' }} // Asegura que el mapa ocupe el 100% del ancho disponible
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[ubicacionMapa.lat, ubicacionMapa.lng]}>
            <Popup>
              Ubicación: {ubicacionMapa.lat}, {ubicacionMapa.lng}
            </Popup>
          </Marker>
        </MapContainer>
      </section>
    </>
  );
};

export default Mapa;
