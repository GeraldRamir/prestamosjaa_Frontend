import { createContext, useState, useEffect, useContext, useRef } from "react";
import {
    getPagosByClienteId,
    addPago,
    updatePago,
    deletePago as deletePagoDb,
} from "../lib/indexedDb";
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
    
        const capitalPrestamo = pagos.length > 0 ? (Number(pagos[0].capital) || 0) : 0;
        let totales = {
            capital: capitalPrestamo,
            avance: 0,
            abono: 0,
            intereses: 0,
            atrasos: 0,
            total: 0,
        };
        pagos.forEach((pago) => {
            if (typeof pago.capital !== "number") pago.capital = 0;
            if (typeof pago.avance !== "number") pago.avance = 0;
            if (typeof pago.abono !== "number") pago.abono = 0;
            if (typeof pago.intereses !== "number") pago.intereses = 0;
            if (typeof pago.atrasos !== "number") pago.atrasos = 0;
            totales.avance += pago.avance;
            totales.abono += pago.abono;
            totales.intereses += pago.intereses;
            totales.atrasos += pago.atrasos;
            totales.total += pago.capital + pago.avance + pago.abono + pago.intereses + pago.atrasos;
        });
        return totales;
    };
    
    const obtenerPagos = async (clienteId) => {
        if (cargando.current || !clienteId) return;
        cargando.current = true;
        try {
            const data = await getPagosByClienteId(clienteId);
            if (Array.isArray(data.pagos)) {
                setPagos(data.pagos);
                setTotales(data.totales || calcularTotales(data.pagos));
            }
            return data;
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

    const crearPago = async (nuevoPago) => {
        try {
            const data = await addPago(nuevoPago.clienteId, nuevoPago);
            setPagos((prevPagos) => {
                const nuevosPagos = [...prevPagos, data];
                setTotales(calcularTotales(nuevosPagos));
                return nuevosPagos;
            });
        } catch (error) {
            console.error("Error al crear el pago:", error);
        }
    };
    const editarPago = async (clienteId, pagoId, pagoEditado) => {
        try {
            const data = await updatePago(clienteId, pagoId, pagoEditado);
            setPagos((prevPagos) => {
                const nuevosPagos = prevPagos.map((pago) => (pago._id === pagoId ? data : pago));
                setTotales(calcularTotales(nuevosPagos));
                return nuevosPagos;
            });
        } catch (error) {
            console.error("Error al editar el pago:", error);
        }
    };

    const eliminarPago = async (clienteId, pagoId) => {
        try {
            await deletePagoDb(clienteId, pagoId);
            setPagos((prevPagos) => {
                const nuevosPagos = prevPagos.filter((pago) => pago._id !== pagoId);
                setTotales(calcularTotales(nuevosPagos));
                return nuevosPagos;
            });
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
