import { useEffect } from 'react';
import { Toast } from 'bootstrap'; // Asegúrate de importar Bootstrap correctamente

const Alerta = ({ alerta, setAlerta }) => {
  useEffect(() => {
    if (alerta.msg) {
      // Asegúrate de que el elemento de toast exista antes de intentar mostrarlo
      const toastEl = document.getElementById('toast');
      if (toastEl) {
        const toast = new Toast(toastEl);
        toast.show();

        // Cerrar el toast después de 5 segundos
        const timer = setTimeout(() => {
          setAlerta({});
        }, 5000);

        return () => clearTimeout(timer); // Limpiar el timer cuando el componente se desmonta
      }
    }
  }, [alerta, setAlerta]);

  return (
    alerta.msg && (
      <div
        className="position-fixed top-0 end-0 p-3"
        style={{ zIndex: 1050 }}
      >
        <div
          id="toast"
          className={`toast ${alerta.error ? 'bg-danger' : 'bg-success'} text-white shadow-lg rounded-3`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{
            minWidth: '300px', 
            animation: 'slideIn 0.5s ease-out forwards', // Aplicando la animación de deslizamiento
          }}
        >
          <div className="toast-header">
            <span
              className={`me-2 p-2 rounded-circle ${
                alerta.error ? 'bg-danger' : 'bg-success'
              }`}
              style={{ width: '25px', height: '25px', display: 'inline-block' }}
            >
              <i className={`bi ${alerta.error ? 'bi-x-circle' : 'bi-check-circle'}`} style={{ fontSize: '1.2rem' }}></i>
            </span>
            <strong className="me-auto" style={{ fontSize: '1.1rem' }}>{alerta.error ? 'Error' : 'Éxito'}</strong>
            <button
              type="button"
              className="btn-close btn-close-dark"
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={() => setAlerta({})}
            ></button>
          </div>
          <div className="toast-body" style={{ fontSize: '1.1rem', padding: '15px' }}>
            {alerta.msg}
          </div>
        </div>
      </div>
    )
  );
};

export default Alerta;
