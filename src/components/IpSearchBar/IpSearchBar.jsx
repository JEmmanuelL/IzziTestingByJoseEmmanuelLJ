/**
 * IpSearchBar.jsx
 * ----------------
 * Componente de búsqueda de IP con:
 * - Input controlado para ingresar la dirección IP
 * - Validación en tiempo real con Regex (IPv4/IPv6)
 * - Spinner de carga mientras se procesa la consulta
 * - Alertas SweetAlert2 para: IP inválida, IP duplicada, errores de API
 *
 * Props:
 * - onSearch: función callback que recibe la IP validada para procesarla
 * - isLoading: booleano que indica si hay una búsqueda en progreso
 *
 * Principio SOLID:
 * - Single Responsibility: solo maneja la UI del buscador y validación de entrada
 */

import { useState } from "react";
import Swal from "sweetalert2";
import { isValidIp } from "../../utils/validators";
import "./IpSearchBar.css";

const IpSearchBar = ({ onSearch, isLoading = false }) => {
  const [ipInput, setIpInput] = useState("");

  /**
   * Maneja el envío del formulario de búsqueda.
   * Valida el formato de IP antes de invocar el callback onSearch.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedIp = ipInput.trim();

    // Validar que el campo no esté vacío
    if (!trimmedIp) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, ingresa una dirección IP para buscar.",
        confirmButtonColor: "#6e8efb",
      });
      return;
    }

    // Validar formato de IP con Regex
    if (!isValidIp(trimmedIp)) {
      Swal.fire({
        icon: "error",
        title: "IP inválida",
        text: "El formato de la dirección IP no es válido. Ejemplo válido: 8.8.8.8",
        confirmButtonColor: "#6e8efb",
      });
      return;
    }

    // IP válida: invocar callback del padre
    onSearch(trimmedIp);
  };

  /**
   * Maneja el cambio del input, permitiendo solo caracteres válidos para IP.
   */
  const handleInputChange = (e) => {
    setIpInput(e.target.value);
  };

  return (
    <section className="search-bar" id="ip-search-bar">
      <form className="search-bar__form" onSubmit={handleSubmit}>
        <div className="search-bar__input-wrapper">
          <input
            id="ip-input"
            type="text"
            className="search-bar__input"
            placeholder="Ingresa una dirección IP (ej. 8.8.8.8)"
            value={ipInput}
            onChange={handleInputChange}
            disabled={isLoading}
            autoComplete="off"
            aria-label="Dirección IP a consultar"
          />
        </div>
        <button
          id="search-button"
          type="submit"
          className="search-bar__button"
          disabled={isLoading}
          aria-label="Buscar información de IP"
        >
          {isLoading ? (
            <span className="search-bar__spinner" aria-hidden="true"></span>
          ) : (
            <>
              <span className="search-bar__icon">🔍</span>
              Buscar
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default IpSearchBar;
