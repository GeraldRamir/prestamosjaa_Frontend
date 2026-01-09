import React, { useState, useContext, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import PagosModal from "./PagosModal";
import PagosContext from "../context/PagosProvider";
import ClienteRow from "./ClienteRow";

const ClienteBody = ({ cliente, onEdit, onDelete }) => {
  const { pagos, editarPago, eliminarPago } = useContext(PagosContext);
  const [modalOpen, setModalOpen] = useState(false);

  const pagosCliente = Array.isArray(pagos)
    ? pagos.filter((p) => p.clienteId === cliente._id)
    : [];

  const handleOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <>
      <ClienteRow
        cliente={cliente}
        onEdit={onEdit}
        onDelete={onDelete}
        onVerPagos={handleOpenModal}
      />

      {/* Modal se renderiza en body, fuera del tbody */}
      {modalOpen &&
        ReactDOM.createPortal(
          <PagosModal
            isOpen={modalOpen}
            onClose={handleCloseModal}
            clienteId={cliente._id}
            pagos={pagosCliente}
            editarPago={editarPago}
            eliminarPago={eliminarPago}
          />,
          document.body
        )}
    </>
  );
};

export default ClienteBody;
