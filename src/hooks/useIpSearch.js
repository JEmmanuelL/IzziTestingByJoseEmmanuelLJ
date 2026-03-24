/**
 * useIpSearch.js
 * ---------------
 * Custom hook que orquesta el flujo completo de búsqueda de IP:
 * 1. Validar formato de IP (delegado al componente IpSearchBar)
 * 2. Verificar duplicado en Firestore
 * 3. Consultar API de geolocalización
 * 4. Guardar resultado en Firestore
 * 5. Actualizar estado local (tabla + mapa)
 *
 * Expone:
 * - records: lista de registros del histórico
 * - selectedRecord: registro seleccionado para el mapa
 * - isLoading: estado de carga
 * - handleSearch: función para ejecutar una búsqueda
 * - handleDelete: función para eliminar un registro
 * - loadRecords: función para recargar registros desde Firestore
 *
 * Principio SOLID:
 * - Interface Segregation: expone solo lo necesario a los componentes
 * - Dependency Inversion: depende de servicios abstractos
 */

import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { saveIpRecord, getAllRecords, deleteRecord, checkDuplicate } from "../services/firestoreService";
import { fetchIpData } from "../services/ipApiService";

const useIpSearch = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Carga todos los registros de Firestore al iniciar.
   */
  const loadRecords = useCallback(async () => {
    try {
      const data = await getAllRecords();
      setRecords(data);
    } catch (error) {
      console.error("Error al cargar registros:", error);
      Swal.fire({
        icon: "error",
        title: "Error de carga",
        text: "No se pudieron cargar los registros. Recarga la página.",
        confirmButtonColor: "#6e8efb",
      });
    }
  }, []);

  // Cargar registros al montar el hook
  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  /**
   * Ejecuta el flujo completo de búsqueda de IP:
   * 1. Verificar duplicado → 2. Consultar API → 3. Guardar en Firestore → 4. Actualizar UI
   * @param {string} ip - Dirección IP ya validada por IpSearchBar
   */
  const handleSearch = async (ip) => {
    setIsLoading(true);

    try {
      // Paso 1: Verificar si la IP ya existe en Firestore (Req. 5)
      const isDuplicate = await checkDuplicate(ip);

      if (isDuplicate) {
        Swal.fire({
          icon: "warning",
          title: "IP duplicada",
          text: `La dirección IP ${ip} ya fue consultada anteriormente. El registro ya existe en la base de datos.`,
          confirmButtonColor: "#6e8efb",
        });
        setIsLoading(false);
        return;
      }

      // Paso 2: Consultar API de geolocalización (solo si NO es duplicada)
      const ipData = await fetchIpData(ip);

      // Paso 3: Guardar en Firestore
      await saveIpRecord(ipData);

      // Paso 4: Recargar registros y seleccionar el nuevo para el mapa
      await loadRecords();
      setSelectedRecord(ipData);

      // Notificación de éxito
      Swal.fire({
        icon: "success",
        title: "¡Consulta exitosa!",
        text: `IP ${ip} registrada correctamente.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ocurrió un error inesperado. Intente nuevamente.",
        confirmButtonColor: "#6e8efb",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Elimina un registro de Firestore y actualiza la tabla.
   * @param {string} recordId - ID del documento en Firestore
   */
  const handleDelete = async (recordId) => {
    try {
      await deleteRecord(recordId);
      await loadRecords();

      // Si el registro eliminado era el seleccionado, limpiar el mapa
      if (selectedRecord && records.find((r) => r.id === recordId)) {
        setSelectedRecord(null);
      }

      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El registro fue eliminado correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al eliminar:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo eliminar el registro.",
        confirmButtonColor: "#6e8efb",
      });
    }
  };

  return {
    records,
    selectedRecord,
    isLoading,
    handleSearch,
    handleDelete,
    setSelectedRecord,
  };
};

export default useIpSearch;
