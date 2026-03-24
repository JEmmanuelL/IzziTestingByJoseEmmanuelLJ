/**
 * validators.js
 * --------------
 * Utilidades puras de validación para direcciones IP.
 * No tiene dependencias externas ni efectos secundarios.
 *
 * Funciones exportadas:
 * - isValidIp(ip) → Valida formato IPv4 e IPv6
 * - isValidIpv4(ip) → Valida específicamente formato IPv4
 * - isValidIpv6(ip) → Valida específicamente formato IPv6
 *
 * Principio SOLID aplicado:
 * - Single Responsibility: solo contiene lógica de validación reutilizable
 */

/**
 * Expresión regular para validar direcciones IPv4.
 * Formato esperado: X.X.X.X donde X es un número de 0 a 255
 * Ejemplos válidos: 192.168.1.1, 8.8.8.8, 255.255.255.255
 */
const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

/**
 * Expresión regular simplificada para validar direcciones IPv6.
 * Acepta el formato completo y abreviado (con ::)
 * Ejemplos válidos: 2001:0db8:85a3::8a2e:0370:7334, ::1, fe80::1
 */
const IPV6_REGEX = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?\d)?\d)\.){3}(25[0-5]|(2[0-4]|1?\d)?\d)|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?\d)?\d)\.){3}(25[0-5]|(2[0-4]|1?\d)?\d))$/;

/**
 * Valida si una cadena es una dirección IPv4 válida.
 * @param {string} ip - Cadena a validar
 * @returns {boolean} true si es IPv4 válida
 */
export const isValidIpv4 = (ip) => {
  if (!ip || typeof ip !== "string") return false;
  return IPV4_REGEX.test(ip.trim());
};

/**
 * Valida si una cadena es una dirección IPv6 válida.
 * @param {string} ip - Cadena a validar
 * @returns {boolean} true si es IPv6 válida
 */
export const isValidIpv6 = (ip) => {
  if (!ip || typeof ip !== "string") return false;
  return IPV6_REGEX.test(ip.trim());
};

/**
 * Valida si una cadena es una dirección IP válida (IPv4 o IPv6).
 * Esta es la función principal que deben usar los componentes.
 *
 * @param {string} ip - Cadena a validar
 * @returns {boolean} true si la IP es válida (IPv4 o IPv6)
 *
 * @example
 * isValidIp("192.168.1.1")     // true
 * isValidIp("8.8.8.8")         // true
 * isValidIp("2001:db8::1")     // true
 * isValidIp("abc.def.ghi.jkl") // false
 * isValidIp("")                // false
 * isValidIp("999.999.999.999") // false
 */
export const isValidIp = (ip) => {
  return isValidIpv4(ip) || isValidIpv6(ip);
};
