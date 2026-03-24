/**
 * firestoreService.js
 * --------------------
 * Servicio responsable de todas las operaciones CRUD contra Cloud Firestore.
 * Colección utilizada: "ip_searches"
 *
 * Funciones exportadas:
 * - saveIpRecord(data)    → Guarda un nuevo registro de IP en Firestore
 * - getAllRecords()        → Obtiene todos los registros ordenados por fecha
 * - deleteRecord(id)      → Elimina un registro por su ID de documento
 * - checkDuplicate(ip)    → Verifica si una IP ya existe en la colección
 *
 * Principio SOLID aplicado:
 * - Single Responsibility: solo maneja persistencia en Firestore
 * - Dependency Inversion: los componentes dependen de este servicio, no de Firestore directamente
 */

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

// Nombre de la colección en Firestore
const COLLECTION_NAME = "ip_searches";

/**
 * Guarda un nuevo registro de IP en Firestore.
 * @param {Object} data - Objeto con los 7 campos clave de la IP
 * @param {string} data.ip - Dirección IP consultada
 * @param {string} data.country - País
 * @param {string} data.city - Ciudad
 * @param {string} data.isp - Proveedor de Internet
 * @param {string} data.threatLevel - Nivel de amenaza
 * @param {number} data.latitude - Latitud
 * @param {number} data.longitude - Longitud
 * @returns {Promise<string>} ID del documento creado
 */
export const saveIpRecord = async (data) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar registro en Firestore:", error);
    throw new Error("No se pudo guardar el registro. Intente nuevamente.");
  }
};

/**
 * Obtiene todos los registros de IP ordenados por fecha de creación (más reciente primero).
 * @returns {Promise<Array>} Lista de registros con sus IDs
 */
export const getAllRecords = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error al obtener registros de Firestore:", error);
    throw new Error("No se pudieron cargar los registros.");
  }
};

/**
 * Elimina un registro de IP por su ID de documento en Firestore.
 * @param {string} recordId - ID del documento a eliminar
 * @returns {Promise<void>}
 */
export const deleteRecord = async (recordId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, recordId));
  } catch (error) {
    console.error("Error al eliminar registro de Firestore:", error);
    throw new Error("No se pudo eliminar el registro. Intente nuevamente.");
  }
};

/**
 * Verifica si una dirección IP ya existe en la colección de Firestore.
 * Se ejecuta ANTES de consumir la API externa para ahorrar llamadas.
 * @param {string} ip - Dirección IP a verificar
 * @returns {Promise<boolean>} true si la IP ya existe, false si no
 */
export const checkDuplicate = async (ip) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("ip", "==", ip)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error al verificar duplicado en Firestore:", error);
    throw new Error("No se pudo verificar si la IP ya existe.");
  }
};
