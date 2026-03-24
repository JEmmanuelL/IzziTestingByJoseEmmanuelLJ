/**
 * useIpSearch.js
 * ---------------
 * Custom hook que orquesta el flujo completo de búsqueda de IP:
 * 1. Validar formato de IP
 * 2. Verificar duplicado en Firestore
 * 3. Consultar API de geolocalización
 * 4. Guardar resultado en Firestore
 * 5. Actualizar estado local (tabla + mapa)
 * 
 * Principio SOLID aplicado:
 * - Interface Segregation: expone solo lo necesario a los componentes de UI.
 * - Dependency Inversion: depende de servicios abstractos, no de implementaciones.
 */

// Se implementará en Fase 3d
