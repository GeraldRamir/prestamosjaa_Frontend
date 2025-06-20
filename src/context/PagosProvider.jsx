import { createContext, useState, useEffect, useContext, useRef } from "react";
import clienteAxios from "../config/axios";
import ClientesContext from "./ClientesProvider";

const PagosContext = createContext();

export const PagosProvider = ({ children }) => {
    const [pagos, setPagos] = useState([]);
    const [totales, setTotales] = useState({
        capital: 0,
        avance: 0,
        abono: 0,
        intereses: 0,
        atrasos: 0,
        total: 0,
    });
    const { clienteSeleccionado } = useContext(ClientesContext);
    const cargando = useRef(false);  // Evita múltiples llamadas simultáneas

    const calcularTotales = (pagos) => {
        if (!Array.isArray(pagos)) {
            console.error("Error: 'pagos' no es un arreglo. Recibido:", pagos);
            return {
                capital: 0,
                avance: 0,
                abono: 0,
                intereses: 0,
                atrasos: 0,
                total: 0,
            };
        }
    
        let totales = {
            capital: 0,
            avance: 0,
            abono: 0,
            intereses: 0,
            atrasos: 0,
            total: 0,
        };
    
        pagos.forEach(pago => {
            if (typeof pago.capital !== 'number') pago.capital = 0;
            if (typeof pago.avance !== 'number') pago.avance = 0;
            if (typeof pago.abono !== 'number') pago.abono = 0;
            if (typeof pago.intereses !== 'number') pago.intereses = 0;
            if (typeof pago.atrasos !== 'number') pago.atrasos = 0;
    
            totales.capital += pago.capital;
            totales.avance += pago.avance;
            totales.abono += pago.abono;
            totales.intereses += pago.intereses;
            totales.atrasos += pago.atrasos;
            totales.total += pago.capital + pago.avance + pago.abono + pago.intereses + pago.atrasos;
        });
    
        return totales;
    };
    
    const obtenerPagos = async (clienteId) => {
        if (cargando.current || !clienteId) return;  // Evita múltiples llamadas
        cargando.current = true;
    
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
    
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };
    
            const { data } = await clienteAxios.get(`pagos/${clienteId}`, config);
            console.log(`Pagos obtenidos para cliente ${clienteId}:`, data);  // Verificar datos obtenidos
    
            if (Array.isArray(data.pagos)) {
                setPagos(data.pagos);
                const totalesCalculados = calcularTotales(data.pagos);
                console.log("Totales calculados:", totalesCalculados);
                setTotales(data.totales);
            } else {
                console.error(`Error: Los pagos para el cliente ${clienteId} no son válidos. Recibido:`, data);
            }
    
            return data;  // Asegúrate de retornar los datos
        } catch (error) {
            console.error(`Error al obtener pagos para el cliente ${clienteId}:`, error);
        } finally {
            cargando.current = false;
        }
    };
    
    
    useEffect(() => {
        // Ejecutar obtenerPagos solo cuando clienteSeleccionado tiene un id
        if (clienteSeleccionado && clienteSeleccionado._id) {
            obtenerPagos(clienteSeleccionado._id);
        }
    }, [clienteSeleccionado]);  // Solo se ejecuta cuando cambia el cliente

    // Crear un nuevo pago dentro del array de pagos del cliente
    const crearPago = async (nuevoPago) => {
        try {
          const token = localStorage.getItem('token');
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };
      
          // Usamos la ruta /pagos/:clienteId
          const { data } = await clienteAxios.post(`pagos/${nuevoPago.clienteId}`, nuevoPago, config);
          console.log("Pago creado:", data);
      
          // Añadir el nuevo pago al estado
          setPagos(prevPagos => {
            const nuevosPagos = [...prevPagos, data];
            setTotales(calcularTotales(nuevosPagos));
            return nuevosPagos;
        });
      
          // Recalcular los totales
        //   const totalesCalculados = calcularTotales([...pagos, data]);

        //   setTotales(totalesCalculados);
        } catch (error) {
          console.error("Error al crear el pago:", error);
        }
      };
    // Editar un pago dentro del array
    const editarPago = async (clienteId, pagoId, pagoEditado) => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await clienteAxios.put(
                `pagos/${clienteId}/${pagoId}`, 
                pagoEditado,
                config
            );

            console.log("Pago editado:", data);

            // Actualizar el pago en el estado local
            setPagos(prevPagos => {
                const nuevosPagos = prevPagos.map(pago => pago._id === pagoId ? data : pago);
                setTotales(calcularTotales(nuevosPagos));
                return nuevosPagos;
            });

            // Recalcular los totales
            // const totalesCalculados = calcularTotales(pagos.map(pago => pago._id === pagoId ? data : pago));
            // setTotales(totalesCalculados);
        } catch (error) {
            console.error("Error al editar el pago:", error);
        }
    };

    // Eliminar un pago del array de pagos del cliente
    const eliminarPago = async (clienteId,pagoId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            };

            await clienteAxios.delete(`/pagos/${clienteId}/${pagoId}`, config);
            console.log("Pago eliminado:", pagoId);

            // Eliminar el pago del estado local
            setPagos(prevPagos => prevPagos.filter(pago => pago._id !== pagoId));

            // Recalcular los totales
            const totalesCalculados = calcularTotales(pagos.filter(pago => pago._id !== pagoId));
            setTotales(totalesCalculados);
        } catch (error) {
            console.error("Error al eliminar el pago:", error);
        }
    };

    return (
        <PagosContext.Provider value={{
            pagos,
            totales,
            obtenerPagos,
            crearPago,
            editarPago,
            eliminarPago,
            setPagos,
        }}>
            {children}
        </PagosContext.Provider>
    );
};

export default PagosContext;
