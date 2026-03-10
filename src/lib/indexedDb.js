/**
 * Servicio IndexedDB para prestamosjaa.
 * Misma estructura de datos, modelos y nombres que el backend; todo se persiste en IndexedDB.
 */

const DB_NAME = "prestamosjaa";
const DB_VERSION = 1;
const STORES = {
  prestamistas: "prestamistas",
  clientes: "clientes",
  pagos: "pagos",
  passwordResetTokens: "passwordResetTokens",
  confirmTokens: "confirmTokens",
};

let dbInstance = null;

function openDB() {
  if (dbInstance) return Promise.resolve(dbInstance);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORES.prestamistas)) {
        const ps = db.createObjectStore(STORES.prestamistas, { keyPath: "_id" });
        ps.createIndex("email", "email", { unique: true });
      }
      if (!db.objectStoreNames.contains(STORES.clientes)) {
        db.createObjectStore(STORES.clientes, { keyPath: "_id" });
      }
      if (!db.objectStoreNames.contains(STORES.pagos)) {
        const pagos = db.createObjectStore(STORES.pagos, { keyPath: "_id" });
        pagos.createIndex("clienteId", "clienteId", { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.passwordResetTokens)) {
        db.createObjectStore(STORES.passwordResetTokens, { keyPath: "token" });
      }
      if (!db.objectStoreNames.contains(STORES.confirmTokens)) {
        db.createObjectStore(STORES.confirmTokens, { keyPath: "token" });
      }
    };
  });
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// --- Prestamistas / Auth ---

export async function getPrestamistaPerfil() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.prestamistas, "readonly");
    const store = tx.objectStore(STORES.prestamistas);
    const req = store.get(token);
    req.onsuccess = () => {
      const p = req.result;
      if (!p) {
        resolve(null);
        return;
      }
      const { password, ...perfil } = p;
      resolve(perfil);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function loginPrestamista(email, password) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.prestamistas, "readonly");
    const store = tx.objectStore(STORES.prestamistas);
    const index = store.index("email");
    const req = index.get(email?.trim?.()?.toLowerCase?.() || email);
    req.onsuccess = () => {
      const prestamista = req.result;
      if (!prestamista) {
        reject({ response: { data: { msg: "Credenciales incorrectas" } } });
        return;
      }
      if (prestamista.password !== password) {
        reject({ response: { data: { msg: "Credenciales incorrectas" } } });
        return;
      }
      if (prestamista.confirmado === false) {
        reject({ response: { data: { msg: "Confirma tu cuenta desde el correo" } } });
        return;
      }
      const { password: _, ...rest } = prestamista;
      resolve({ token: prestamista._id, ...rest });
    };
    req.onerror = () => reject(req.error);
  });
}

export async function registrarPrestamista(nombre, email, password) {
  const db = await openDB();
  const id = generateId();
  const emailNorm = (email || "").trim().toLowerCase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.prestamistas, "readwrite");
    const store = tx.objectStore(STORES.prestamistas);
    const index = store.index("email");
    const checkReq = index.get(emailNorm);
    checkReq.onsuccess = () => {
      if (checkReq.result) {
        reject({ response: { data: { msg: "El correo ya está registrado" } } });
        return;
      }
      const prestamista = {
        _id: id,
        nombre: nombre || "",
        email: emailNorm,
        password: password || "",
        confirmado: true,
      };
      store.put(prestamista);
      tx.oncomplete = () => resolve({ msg: "Usuario creado correctamente, revisa tu email" });
      tx.onerror = () => reject(tx.error);
    };
    checkReq.onerror = () => reject(checkReq.error);
  });
}

export async function olvidePassword(email) {
  const token = generateId();
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORES.prestamistas, STORES.passwordResetTokens], "readwrite");
    const storeP = tx.objectStore(STORES.prestamistas);
    const index = storeP.index("email");
    const req = index.get((email || "").trim().toLowerCase());
    req.onsuccess = () => {
      const prestamista = req.result;
      if (!prestamista) {
        resolve({ msg: "Si el correo existe, recibirás instrucciones" });
        return;
      }
      const storeToken = tx.objectStore(STORES.passwordResetTokens);
      storeToken.put({ token, email: prestamista.email, createdAt: Date.now() });
      tx.oncomplete = () => resolve({ msg: "Si el correo existe, recibirás instrucciones" });
      tx.onerror = () => reject(tx.error);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function validarTokenOlvidePassword(token) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.passwordResetTokens, "readonly");
    const req = tx.objectStore(STORES.passwordResetTokens).get(token);
    req.onsuccess = () => (req.result ? resolve() : reject(new Error("Token inválido")));
    req.onerror = () => reject(req.error);
  });
}

export async function nuevoPassword(token, password) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORES.passwordResetTokens, STORES.prestamistas], "readwrite");
    const storeToken = tx.objectStore(STORES.passwordResetTokens);
    const storeP = tx.objectStore(STORES.prestamistas);
    const getToken = storeToken.get(token);
    getToken.onsuccess = () => {
      const record = getToken.result;
      if (!record) {
        reject({ response: { data: { msg: "Enlace inválido o expirado" } } });
        return;
      }
      const index = storeP.index("email");
      const getP = index.get(record.email);
      getP.onsuccess = () => {
        const p = getP.result;
        if (!p) {
          reject({ response: { data: { msg: "Usuario no encontrado" } } });
          return;
        }
        p.password = password;
        storeP.put(p);
        storeToken.delete(token);
        tx.oncomplete = () => resolve({ msg: "Contraseña actualizada correctamente" });
      };
      getP.onerror = () => reject(getP.error);
    };
    getToken.onerror = () => reject(getToken.error);
    tx.onerror = () => reject(tx.error);
  });
}

export async function confirmarCuenta(token) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORES.confirmTokens, STORES.prestamistas], "readwrite");
    const storeConfirm = tx.objectStore(STORES.confirmTokens);
    const storeP = tx.objectStore(STORES.prestamistas);
    const getConfirm = storeConfirm.get(token);
    getConfirm.onsuccess = () => {
      const record = getConfirm.result;
      const prestamistaId = record?.prestamistaId || token;
      const getP = storeP.get(prestamistaId);
      getP.onsuccess = () => {
        const p = getP.result;
        if (p) {
          p.confirmado = true;
          storeP.put(p);
        }
        if (record) storeConfirm.delete(token);
        tx.oncomplete = () => resolve({ msg: "Cuenta confirmada" });
      };
      getP.onerror = () => reject(getP.error);
    };
    getConfirm.onerror = () => reject(getConfirm.error);
    tx.onerror = () => reject(tx.error);
  });
}

// Registrar guarda el prestamista con confirmado: true por defecto (sin email real).
// Si en el futuro se usa confirmación por token, se puede guardar un token en confirmTokens.

// --- Clientes ---

export async function getClientes() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.clientes, "readonly");
    const req = tx.objectStore(STORES.clientes).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function addCliente(cliente) {
  const db = await openDB();
  const id = cliente._id || generateId();
  const doc = { ...cliente, _id: id };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.clientes, "readwrite");
    tx.objectStore(STORES.clientes).put(doc);
    tx.oncomplete = () => resolve(doc);
    tx.onerror = () => reject(tx.error);
  });
}

export async function updateCliente(cliente) {
  if (!cliente._id) return Promise.reject(new Error("Cliente sin _id"));
  return addCliente(cliente);
}

export async function deleteCliente(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORES.clientes, STORES.pagos], "readwrite");
    const storeC = tx.objectStore(STORES.clientes);
    const storeP = tx.objectStore(STORES.pagos);
    const indexP = storeP.index("clienteId");
    const reqDelete = indexP.getAllKeys(id);
    reqDelete.onsuccess = () => {
      reqDelete.result.forEach((key) => storeP.delete(key));
      storeC.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
    reqDelete.onerror = () => reject(reqDelete.error);
  });
}

// --- Pagos ---

function calcularTotalesPagos(pagos) {
  const totales = {
    capital: 0,
    avance: 0,
    abono: 0,
    intereses: 0,
    atrasos: 0,
    total: 0,
    descuento: 0,
  };
  if (!Array.isArray(pagos)) return totales;
  if (pagos.length > 0) totales.capital = Number(pagos[0].capital) || 0;
  pagos.forEach((pago) => {
    totales.avance += Number(pago.avance) || 0;
    totales.abono += Number(pago.abono) || 0;
    totales.intereses += Number(pago.intereses) || 0;
    totales.atrasos += Number(pago.atrasos) || 0;
    totales.descuento += Number(pago.descuento) || 0;
    totales.total +=
      (Number(pago.capital) || 0) +
      (Number(pago.avance) || 0) +
      (Number(pago.abono) || 0) +
      (Number(pago.intereses) || 0) +
      (Number(pago.atrasos) || 0);
  });
  return totales;
}

export async function getPagosByClienteId(clienteId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.pagos, "readonly");
    const index = tx.objectStore(STORES.pagos).index("clienteId");
    const req = index.getAll(clienteId);
    req.onsuccess = () => {
      const pagos = req.result || [];
      const totales = calcularTotalesPagos(pagos);
      resolve({ pagos, totales });
    };
    req.onerror = () => reject(req.error);
  });
}

export async function addPago(clienteId, pago) {
  const db = await openDB();
  const id = pago._id || generateId();
  const doc = { ...pago, _id: id, clienteId };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.pagos, "readwrite");
    tx.objectStore(STORES.pagos).put(doc);
    tx.oncomplete = () => resolve(doc);
    tx.onerror = () => reject(tx.error);
  });
}

export async function updatePago(clienteId, pagoId, pago) {
  const doc = { ...pago, _id: pagoId, clienteId };
  return addPago(clienteId, doc);
}

export async function deletePago(clienteId, pagoId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.pagos, "readwrite");
    tx.objectStore(STORES.pagos).delete(pagoId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
