import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import PagosContext from "../context/PagosProvider";
import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";
import Alerta from "./Alerta";
import { aplicarCalculoAFila } from "../lib/calculoPrestamo";

const PagosModal = ({ isOpen, onClose, clienteId, valorPrestamoCliente, tasaInteres }) => {
  const { obtenerPagos, crearPago, editarPago, eliminarPago } = useContext(PagosContext);
  const [pagosEditable, setPagosEditable] = useState([]);
  const [valorPrestamo, setValorPrestamo] = useState(0);
  const tasa = Number(tasaInteres) || 0;
  /** Base para el cálculo del interés: monto del préstamo (no el saldo capital de la fila) */
  const montoPrestamo =
    Number(valorPrestamoCliente) || Number(valorPrestamo) || 0;
  const [guardando, setGuardando] = useState(false);
    const [alerta, setAlerta] = useState({});
      const [filaSeleccionada, setFilaSeleccionada] = useState(null);
      const [pagosEliminados, setPagosEliminados] = useState([]);

const handleDeleteRow = () => {
  if (filaSeleccionada === null) {
    toast.info("Seleccione una fila para eliminar");
    return;
  }
  if (filaSeleccionada >= pagosEditable.length) {
    toast.warning("Fila no válida");
    return;
  }

  // Captura el ID si existe
  const pagoEliminado = pagosEditable[filaSeleccionada];
  if (pagoEliminado?._id) {
    setPagosEliminados((prev) => [...prev, pagoEliminado._id]);
  }

  // Elimina la fila del estado
  setPagosEditable((prev) => prev.filter((_, i) => i !== filaSeleccionada));
  setFilaSeleccionada(null);
};

  useEffect(() => {
    if (isOpen && clienteId) {
      const cargarPagos = async () => {
        try {
          console.log("Cargando pagos para el cliente:", clienteId);
          const pagosCliente = await obtenerPagos(clienteId);
          console.log("Pagos obtenidos:", pagosCliente);
  
          if (pagosCliente && pagosCliente.pagos && Array.isArray(pagosCliente.pagos)) {
            const pagos = pagosCliente.pagos;
            const tasaAct = Number(tasaInteres) || 0;
            const valorPrestamoInicial = Number(valorPrestamoCliente) || pagos[0]?.capital || 0;
            setValorPrestamo(valorPrestamoInicial);
            const basePrestamo =
              Number(valorPrestamoCliente) || valorPrestamoInicial || 0;
            setPagosEditable(
              pagos.length
                ? pagos.map((p) => aplicarCalculoAFila(p, tasaAct, basePrestamo))
                : [
                    aplicarCalculoAFila(
                      {
                        clienteId,
                        quincena: "",
                        capital: valorPrestamoInicial,
                        avance: 0,
                        abono: 0,
                        intereses: 0,
                        total: 0,
                        atrasos: 0,
                      },
                      tasaAct,
                      basePrestamo
                    ),
                  ]
            );
          } else {
            console.error("Error: No se recibieron pagos válidos.", pagosCliente);
            toast.error("No se pudieron cargar los pagos.");
          }
        } catch (error) {
          console.error("Error obteniendo pagos:", error);
          toast.error("No se pudieron cargar los pagos.");
        }
      };
  
      cargarPagos();
    }
  }, [isOpen, clienteId, tasaInteres, valorPrestamoCliente])

  const columnas = [
    {
      data: "quincena",
      type: "date",
      title: "Quincena",
      dateFormat: "YYYY-MM-DD",
      correctFormat: true,
      defaultDate: new Date(),
      allowInvalid: false,
      datePickerConfig: {
        firstDay: 1,
        showWeekNumbers: true,
        disableMobile: true,
      },
    },
    { data: "capital", type: "numeric", title: "Capital" },
    { data: "avance", type: "numeric", title: "Avance" },
    { data: "abono", type: "numeric", title: "Abono" },
    { data: "intereses", type: "numeric", title: "Intereses", readOnly: true },
    { data: "total", type: "numeric", title: "Total", readOnly: true },
    { data: "atrasos", type: "numeric", title: "Atrasos" },
  ];

  const addNewRow = () => {
    setPagosEditable((prevPagos) => {
      const base = {
        clienteId,
        quincena: new Date().toISOString().split("T")[0],
        capital: valorPrestamo,
        avance: 0,
        abono: 0,
        intereses: 0,
        total: 0,
        atrasos: 0,
      };
      return [...prevPagos, aplicarCalculoAFila(base, tasa, montoPrestamo)];
    });
  };
  
  
  

const handleSave = async () => {
  setGuardando(true);
  setAlerta({
    msg: "Guardando cambios...",
    error: false,
  });

  try {
    console.log("Guardando cambios con los siguientes pagos:", pagosEditable);

    if (!clienteId) {
      console.error("Error: clienteId no está definido.");
      toast.error("No se puede guardar sin un cliente.");
      return;
    }

    // 🔴 Primero eliminamos los pagos eliminados visualmente
 for (const pagoId of pagosEliminados) {
  try {
    await eliminarPago(clienteId, pagoId);
    console.log("Pago eliminado:", pagoId);
  } catch (error) {
    console.error("Error al eliminar el pago:", pagoId, error);
  }
}


    const pagosConFecha = pagosEditable.map((pago) => {
      const o = { ...pago };
      if (!o.quincena) {
        o.quincena = new Date().toISOString().split("T")[0];
      }
      return aplicarCalculoAFila(o, tasa, montoPrestamo);
    });

    for (const pago of pagosConFecha) {
      if (pago._id) {
        await editarPago(clienteId, pago._id, pago);
      } else {
        await crearPago(pago);
      }
    }

    toast.success("Pagos guardados correctamente");
    setPagosEliminados([]); // 🔄 Limpiar los eliminados
    onClose();
  } catch (error) {
    toast.error("Error al guardar los pagos");
    console.error("Error al guardar pagos:", error);
  } finally {
    setGuardando(false);
  }
};

    const handleAfterSelectionEnd = (row, col, row2, col2) => {
    if (typeof row === "number" && row < pagosEditable.length) {
      setFilaSeleccionada(row);
    } else {
      setFilaSeleccionada(null);
    }
  };
    const beforeColumnRemove = (index) => {
    removeColumn(index);
    return false; // evitar que HT elimine automáticamente
  };
  
  
  // const handleColumnChange = (changes, source) => {
  //   if (source !== "loadData" && changes) {
  //     setPagosEditable((prevPagos) => {
  //       const updatedPagos = [...prevPagos];
  //       changes.forEach(([row, prop, oldVal, newVal]) => {
  //         if (row < updatedPagos.length) {
  //           updatedPagos[row] = { ...updatedPagos[row], [prop]: newVal };
  //         }
  //       });
  //       return updatedPagos;
  //     });
  //   }
  // };

  const addNewColumn = () => {
    const newColumn = { data: `columna_${columnas.length + 1}`, type: "text", title: `Nueva Columna ${columnas.length + 1}` };
    setColumnas([...columnas, newColumn]);
  };

  const removeColumn = (index) => {
    setColumnas((prev) => prev.filter((_, i) => i !== index));
  };
  const handleRowRemove = (index, amount) => {
    setPagosEditable((prev) => {
      const updatedPagos = [...prev];
      updatedPagos.splice(index, amount);
      return updatedPagos;
    });
  };
  
  
  
  return (
    <>
        {/* Mostrar alerta solo si hay mensaje */}
        {alerta.msg && <Alerta alerta={alerta}/>}
      {guardando && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50" style={{ zIndex: 1055 }}>
          <div className="text-center text-white">
            <div className="spinner-border text-light" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Guardando...</span>
            </div>
            <div className="mt-2">Guardando pagos...</div>
          </div>
        </div>
      )}
  
      <Modal show={isOpen} onHide={onClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Pagos del Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ maxHeight: "400px", overflowY: "auto", padding: "5px", borderRadius: "5px" }}>
            <HotTable
              data={pagosEditable}
              colHeaders={columnas.map((c) => c.title)}
              columns={columnas}
              rowHeaders={true}
              licenseKey="non-commercial-and-evaluation"
              afterChange={(changes, source) => {
                if (Array.isArray(changes) && source !== 'loadData') {
                  setPagosEditable((prevPagos) => {
                    const updatedPagos = [...prevPagos];
                    changes.forEach(([row, prop, oldVal, newVal]) => {
                      if (row >= updatedPagos.length) return;
                      let pago = { ...updatedPagos[row] };
                      if (prop === "avance") {
                        pago.capital = (Number(pago.capital) || 0) + (Number(newVal) || 0) - (Number(oldVal) || 0);
                        pago.avance = newVal;
                      } else if (prop === "abono") {
                        pago.capital = (Number(pago.capital) || 0) - ((Number(newVal) || 0) - (Number(oldVal) || 0));
                        pago.abono = newVal;
                      } else {
                        pago = { ...pago, [prop]: newVal };
                      }
                      updatedPagos[row] = aplicarCalculoAFila(
                        pago,
                        tasa,
                        montoPrestamo
                      );
                    });
                    return updatedPagos;
                  });
                }
              }}
              height={pagosEditable.length > 5 ? "auto" : "300px"}
              stretchH="all"
              dropdownMenu={true}
              contextMenu={['row_above', 'row_below', 'remove_row', 'undo', 'redo', 'make_read_only', 'copy', 'cut', 'paste']}
              manualColumnInsert={true}
              manualColumnResize={true}
              manualRowResize={true}
              manualColumnMove={true}
              filters={true}
              manualRowMove={true}
              manualColumnRemove={true}
              manualRowRemove={true}
              afterRemoveRow={(index, amount) => {
                // No queremos que Handsontable elimine filas, sino manual
                setPagosEditable((prev) => {
                  const copy = [...prev];
                  copy.splice(index, amount);
                  return copy;
                });
              }}
              beforeColumnRemove={beforeColumnRemove}
              afterSelectionEnd={handleAfterSelectionEnd}
              cells={(row) => {
                if (row === pagosEditable.length) return { readOnly: true, className: "htDimmed" };
                return {};
              }}
            />
          </div>
           <Button variant="primary" onClick={addNewRow} className="mt-3 me-2">
            ➕ Agregar Fila
          </Button>
          <Button variant="danger" onClick={handleDeleteRow} className="mt-3">
            🗑️ Eliminar Fila Seleccionada
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={guardando}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={guardando}>
            {guardando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
  
};

export default PagosModal;
