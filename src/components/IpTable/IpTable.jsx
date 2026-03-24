/**
 * IpTable.jsx
 * ------------
 * Componente de tabla para mostrar el histórico de consultas de IP.
 * Características:
 * - Muestra 7 columnas: IP, País, Ciudad, ISP, Amenaza, Latitud, Longitud
 * - Filtro de texto por cualquier columna
 * - Paginación nativa configurable
 * - Botón de eliminación por fila con confirmación SweetAlert2
 * - Estado vacío cuando no hay registros
 *
 * Props:
 * - records: Array de objetos con los datos de IP
 * - onDelete: función callback para eliminar un registro por ID
 * - isLoading: booleano que indica si se están cargando los datos
 *
 * Principio SOLID:
 * - Single Responsibility: solo maneja la presentación y filtrado de datos en tabla
 */

import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import "./IpTable.css";

// Número de registros por página
const ROWS_PER_PAGE = 5;

const IpTable = ({ records = [], onDelete, isLoading = false }) => {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Filtra los registros según el texto ingresado.
   * Busca coincidencias en todas las columnas de forma case-insensitive.
   */
  const filteredRecords = useMemo(() => {
    if (!filterText.trim()) return records;

    const searchTerm = filterText.toLowerCase().trim();
    return records.filter((record) =>
      Object.values(record).some((value) =>
        String(value).toLowerCase().includes(searchTerm)
      )
    );
  }, [records, filterText]);

  /**
   * Calcula los registros visibles de la página actual.
   */
  const totalPages = Math.ceil(filteredRecords.length / ROWS_PER_PAGE);
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredRecords.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  /**
   * Maneja la eliminación de un registro con confirmación SweetAlert2.
   * @param {string} recordId - ID del documento en Firestore
   * @param {string} ip - IP del registro (para mostrar en la confirmación)
   */
  const handleDelete = (recordId, ip) => {
    Swal.fire({
      title: "¿Eliminar registro?",
      text: `Se eliminará el registro de la IP: ${ip}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(recordId);
      }
    });
  };

  /**
   * Resetea la página actual cuando cambia el filtro.
   */
  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    setCurrentPage(1);
  };

  /**
   * Retorna la clase CSS según el nivel de amenaza.
   */
  const getThreatClass = (level) => {
    switch (level) {
      case "Peligrosa":
        return "ip-table__threat--danger";
      case "Sospechosa":
        return "ip-table__threat--warning";
      case "Segura":
        return "ip-table__threat--safe";
      default:
        return "ip-table__threat--unknown";
    }
  };

  // Estado vacío: no hay registros en la base de datos
  if (!isLoading && records.length === 0) {
    return (
      <section className="ip-table" id="ip-table">
        <div className="ip-table__empty">
          <span className="ip-table__empty-icon">🌐</span>
          <h3>Aún no hay consultas</h3>
          <p>¡Busca tu primera IP para comenzar!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="ip-table" id="ip-table">
      {/* Barra de filtro */}
      <div className="ip-table__filter">
        <input
          id="table-filter-input"
          type="text"
          className="ip-table__filter-input"
          placeholder="Filtrar registros..."
          value={filterText}
          onChange={handleFilterChange}
          aria-label="Filtrar registros de la tabla"
        />
        <span className="ip-table__filter-count">
          {filteredRecords.length} de {records.length} registros
        </span>
      </div>

      {/* Tabla de datos */}
      <div className="ip-table__wrapper">
        <table className="ip-table__table">
          <thead>
            <tr>
              <th>IP</th>
              <th>País</th>
              <th>Ciudad</th>
              <th>ISP</th>
              <th>Amenaza</th>
              <th>Latitud</th>
              <th>Longitud</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan="8" className="ip-table__no-results">
                  No se encontraron registros con ese filtro.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record) => (
                <tr key={record.id}>
                  <td className="ip-table__ip-cell">{record.ip}</td>
                  <td>{record.country}</td>
                  <td>{record.city}</td>
                  <td>{record.isp}</td>
                  <td>
                    <span
                      className={`ip-table__threat ${getThreatClass(
                        record.threatLevel
                      )}`}
                    >
                      {record.threatLevel}
                    </span>
                  </td>
                  <td>{record.latitude}</td>
                  <td>{record.longitude}</td>
                  <td>
                    <button
                      className="ip-table__delete-btn"
                      onClick={() => handleDelete(record.id, record.ip)}
                      aria-label={`Eliminar registro de IP ${record.ip}`}
                      title="Eliminar registro"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="ip-table__pagination">
          <button
            className="ip-table__page-btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Anterior
          </button>
          <span className="ip-table__page-info">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="ip-table__page-btn"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Siguiente →
          </button>
        </div>
      )}
    </section>
  );
};

export default IpTable;
