import { createContext, useState, useEffect } from "react";
import {
    getClientes,
    addCliente,
    updateCliente,
    deleteCliente as deleteClienteDb,
    getPagosByClienteId,
} from "../lib/indexedDb";

const ClientesContext = createContext();

export const ClientesProvider = ({ children }) => {
    const [clientes, setClientes] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");

    useEffect(() => {
        if (empresaSeleccionada === "") {
            setClientesFiltrados(clientes);
        } else {
            const filtrados = clientes.filter(
                (cliente) => (cliente.empresa || cliente.Empresa) === empresaSeleccionada
            );
            setClientesFiltrados(filtrados);
        }
    }, [empresaSeleccionada, clientes]);

    const obtenerClientes = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const data = await getClientes();
            setClientes(data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        obtenerClientes();
    }, []);

    const guardarCliente = async (cliente) => {
        try {
            const data = await addCliente(cliente);
            setClientes((prevClientes) => [...prevClientes, data]);
            if (data._id) {
                obtenerPagos(data._id);
            }
        } catch (error) {
            console.error("Error al guardar el cliente:", error);
        }
    };

    const obtenerPagos = async (clienteId) => {
        try {
            if (!clienteId) return;
            await getPagosByClienteId(clienteId);
        } catch (error) {
            console.log(error);
        }
    };

    const eliminarCliente = async (id) => {
        try {
            await deleteClienteDb(id);
            setClientes((prevClientes) => prevClientes.filter((cliente) => cliente._id !== id));
        } catch (error) {
            console.error("Error al eliminar el cliente:", error);
        }
    };

    const editarCliente = async (cliente) => {
        try {
            const data = await updateCliente(cliente);
            setClientes((prev) => prev.map((c) => (c._id === data._id ? data : c)));
        } catch (error) {
            console.error("Error al actualizar cliente:", error?.message || error);
        }
    };

    return (
        <ClientesContext.Provider value={{
            clientes,
            clientesFiltrados,
            obtenerClientes,
            guardarCliente,
            eliminarCliente,
            editarCliente,
            setClienteSeleccionado,
            clienteSeleccionado,
            setEmpresaSeleccionada,
        }}>
            {children}
        </ClientesContext.Provider>
        
    );
};

export default ClientesContext;
