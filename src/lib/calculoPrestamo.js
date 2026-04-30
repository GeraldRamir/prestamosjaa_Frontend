/**
 * Misma lógica que el backend: intereses = (tasa % / 100) * valorPrestamo (monto del préstamo)
 * total = capital + avance + abono + intereses + atrasos
 */
export function calcularInteresYTotalFila({
  capital,
  avance,
  abono,
  atrasos,
  tasaInteresPercent,
  valorPrestamo,
}) {
  const c = Number(capital) || 0;
  const a = Number(avance) || 0;
  const b = Number(abono) || 0;
  const at = Number(atrasos) || 0;
  const t = Number(tasaInteresPercent) || 0;
  const prestamo = Number(valorPrestamo) || 0;
  const intereses = (t / 100) * prestamo;
  const total = c + a + b + intereses + at;
  return { intereses, total };
}

/**
 * Aplica tasa y totales a una fila pago (object spread safe).
 * @param valorPrestamo monto del préstamo (base del %)
 */
export function aplicarCalculoAFila(pago, tasaInteresPercent, valorPrestamo) {
  const { intereses, total } = calcularInteresYTotalFila({
    capital: pago.capital,
    avance: pago.avance,
    abono: pago.abono,
    atrasos: pago.atrasos,
    tasaInteresPercent,
    valorPrestamo,
  });
  return { ...pago, intereses, total };
}
