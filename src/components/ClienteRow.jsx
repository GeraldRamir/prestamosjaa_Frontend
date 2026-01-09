const ClienteRow = ({ cliente, onEdit, onDelete, onVerPagos }) => {
  return (
    <tr>
      <td onClick={() => onVerPagos(cliente)} style={{ cursor: "pointer" }}>
        {cliente.nombre}
      </td>
      <td>{cliente.telefono}</td>
      <td>{cliente.Empresa}</td>
      <td>{cliente.bank}</td>
      <td>{cliente.FechaIngreso}</td>
      <td>{cliente.FechaPago}</td>
      <td>
        <span className="badge bg-success">RD$ {cliente.ValorPrestamo}</span>
      </td>
      <td>{cliente.NumeroCuenta}</td>
      <td>{cliente.Clavedetarjeta}</td>
      <td>{cliente.Interes}</td>
      <td>
        <span
          onClick={() =>
            cliente.ubicacion?.lat &&
            cliente.ubicacion?.lng &&
            window.open(`https://maps.google.com/?q=${cliente.ubicacion.lat},${cliente.ubicacion.lng}`, '_blank')
          }
          style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}
        >
          {cliente.nombreUbicacion || "Ubicación no disponible"}
        </span>
      </td>
      <td className="d-flex gap-2">
        <button
          onClick={() => onEdit(cliente)}
          className="btn btn-sm btn-warning"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(cliente._id)}
          className="btn btn-sm btn-danger"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
};
export default ClienteRow;
