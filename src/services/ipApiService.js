/**
 * ipApiService.js
 * ----------------
 * Servicio responsable de consumir la API externa de geolocalización (ipapi.co).
 * Retorna los 7 campos clave normalizados para uso interno.
 *
 * API utilizada: https://ipapi.co/{ip}/json/
 * - Gratuita, sin autenticación compleja para pruebas pequeñas
 * - Devuelve latitud, longitud, país, ciudad, ISP, etc.
 *
 * Funciones exportadas:
 * - fetchIpData(ip) → Consulta la API y retorna objeto normalizado con 7 campos
 *
 * Principio SOLID aplicado:
 * - Single Responsibility: solo maneja comunicación con la API de geolocalización
 * - Liskov Substitution: puede intercambiarse por ipinfo.io sin romper el flujo
 */

// URL base de la API de geolocalización
const API_BASE_URL = "https://ipapi.co";

/**
 * Consulta la API de geolocalización para obtener información de una IP.
 * Normaliza la respuesta a los 7 campos clave del proyecto.
 *
 * @param {string} ip - Dirección IP a consultar
 * @returns {Promise<Object>} Objeto normalizado con los 7 campos:
 *   - ip: Dirección IP
 *   - country: País
 *   - city: Ciudad
 *   - isp: Proveedor de Internet (ISP)
 *   - threatLevel: Nivel de amenaza (Segura/Desconocida)
 *   - latitude: Latitud
 *   - longitude: Longitud
 * @throws {Error} Si la API no responde o la IP no existe
 */
export const fetchIpData = async (ip) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${ip}/json/`);

    // Verificar que la respuesta sea exitosa
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Verificar si la API devolvió un error (IP inválida o no encontrada)
    if (data.error) {
      throw new Error(data.reason || "IP no encontrada o inválida.");
    }

    // Normalizar la respuesta a los 7 campos clave
    return normalizeIpData(data);
  } catch (error) {
    // Re-lanzar errores conocidos
    if (error.message.includes("IP no encontrada") || error.message.includes("Error HTTP")) {
      throw error;
    }

    // Error de red u otro error inesperado
    console.error("Error al consultar la API de geolocalización:", error);
    throw new Error("No se pudo obtener la información de esta IP. Verifique su conexión a internet.");
  }
};

/**
 * Normaliza la respuesta cruda de la API al formato interno del proyecto.
 * Extrae solo los 7 campos relevantes y aplica valores por defecto.
 *
 * @param {Object} rawData - Respuesta cruda de ipapi.co
 * @returns {Object} Datos normalizados
 */
const normalizeIpData = (rawData) => {
  return {
    ip: rawData.ip || "Desconocida",
    country: rawData.country_name || "Desconocido",
    city: rawData.city || "Desconocida",
    isp: rawData.org || "Desconocido",
    threatLevel: evaluateThreatLevel(rawData),
    latitude: rawData.latitude || 0,
    longitude: rawData.longitude || 0,
  };
};

/**
 * Evalúa el nivel de amenaza basándose en la información disponible.
 * ipapi.co no tiene un campo directo de "threat", así que se evalúa
 * según el tipo de IP (proxy, VPN, Tor, etc.) si está disponible.
 *
 * @param {Object} data - Datos crudos de la API
 * @returns {string} Nivel de amenaza: "Segura", "Sospechosa" o "Desconocida"
 */
const evaluateThreatLevel = (data) => {
  // Si la API provee datos de seguridad/amenaza, evaluarlos
  if (data.is_threat) return "Peligrosa";
  if (data.threat && data.threat.is_threat) return "Peligrosa";

  // Verificar si es un proxy, VPN o nodo Tor (indicadores de riesgo)
  if (data.proxy || data.is_proxy) return "Sospechosa";
  if (data.vpn || data.is_vpn) return "Sospechosa";
  if (data.tor || data.is_tor) return "Sospechosa";

  // Si no hay indicadores negativos, se considera segura
  return "Segura";
};
