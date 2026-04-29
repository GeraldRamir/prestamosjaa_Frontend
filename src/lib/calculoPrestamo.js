/**
 * Misma lógica que el backend: intereses = (tasa % / 100) * capital
 * total = capital + avance + abono + intereses + atrasos
 */
export function calcularInteresYTotalFila({
  capital,
  avance,
  abono,
  atrasos,
  tasaInteresPercent,
}) {
  const c = Number(capital) || 0;
  const a = Number(avance) || 0;
  const b = Number(abono) || 0;
  const at = Number(atrasos) || 0;
  const t = Number(tasaInteresPercent) || 0;
  const intereses = (t / 100) * c;
  const total = c + a + b + intereses + at;
  return { intereses, total };
}

/**
 * Aplica tasa y totales a una fila pago (object spread safe).
 */
export function aplicarCalculoAFila(pago, tasaInteresPercent) {
  const { intereses, total } = calcularInteresYTotalFila({
    capital: pago.capital,
    avance: pago.avance,
    abono: pago.abono,
    atrasos: pago.atrasos,
    tasaInteresPercent,
  });
  return { ...pago, intereses, total };
}
