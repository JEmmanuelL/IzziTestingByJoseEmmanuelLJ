# IP Lookup - Plataforma de Geolocalización Frontend
> **Test Técnico by Jose Emmanuel**

Esta aplicación es una Single Page Application (SPA) construida con React y Vite que permite consultar cualquier dirección IP, visualizarla en un mapa interactivo (Leaflet), y mantener un histórico en tiempo real de las búsquedas en Google Cloud Firestore. Implementa arquitectura **SOLID**, validaciones robustas y diseño premium (Dark Glassmorphism).

---

##  Cómo ejecutar localmente

> **Nota para el evaluador:** Pensando en facilitar la revisión de esta prueba técnica, el archivo `.env` ha sido **subido intencionalmente** al repositorio. Este archivo contiene las claves públicas para conectarse al entorno de pruebas de Firebase. **No necesitas configurar nada adicional ni crear cuentas**.

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/JEmmanuelL/IzziTestingByJoseEmmanuelLJ.git
   cd IzziTestingByJoseEmmanuelLJ
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Levanta el servidor local de desarrollo**
   ```bash
   npm run dev
   ```

4. **(Opcional) Ejecuta las pruebas unitarias**
   ```bash
   npm run test
   ```

---

## Enlace a Producción

La aplicación está desplegada de forma continua y automática (CI/CD) a través de GitHub Actions en Firebase Hosting.  
Puedes acceder a la URL desde: https://testingizzi.web.app o https://testingizzi.firebaseapp.com

---

##  Tecnologías Utilizadas

- **Frontend Core**: React 19 + Vite (Rendimiento optimizado y HMR ultrarrápido).
- **Base de Datos**: Firebase Cloud Firestore.
- **Geolocalización**: API de [ipapi.co](https://ipapi.co) (Capa gratuita, sin auth, respuesta inmediata).
- **Mapas**: Leaflet + `react-leaflet` (Mapas open-source basados en OpenStreetMap sin APIs de paga).
- **Estilos**: Vanilla CSS con variables (`index.css`), Dark Mode y Glassmorphism nativo (nada de librerías extras pesadas para mantener la customización).
- **Alertas**: SweetAlert2.
- **Testing**: Vitest + React Testing Library.
- **CI/CD**: GitHub Actions.

---

##  ¿Por qué Firebase en lugar de una arquitectura tradicional (.NET -> SQL)?

Para los requerimientos del ejercicio (un tracker de histórico con frontend ágil), el uso de Firestore (Serverless & NoSQL) fue la decisión arquitectónica más óptima por las siguientes razones de ingeniería de software:

1. **Time-to-Market y Agilidad**: Una arquitectura monolítica o de microservicios tradicional con un Backend en `.NET` y una base de datos Relacional `SQL` hubiese requerido:
   * Diseñar, modelar y normalizar la DB (+ migraciones).
   * Crear controladores, DTOs, interfaces Repository, inyección de dependencias en C#.
   * Desplegar 2 entidades separadas (Web App Service + PaaS/IaaS DB) manejando CORS, HTTPS, logs...
   * **Con Firebase**, la conexión es directa y robusta vía SDK oficial ahorrando días de desarrollo e infraestructura para lo que es esencialmente un requisito CRUD 1-a-1.

2. **Reactividad en Tiempo Real (Sincronización)**: Al agregar un registro en Firestore en un dispositivo, se podría ver inmediatamente sincronizado en otros navegadores sin recargar gracias a sus WebSockets internos, lo que en C# `.NET` implicaría configurar un servidor extra completo con SignalR y manejar los hubs manualmente.

3. **Escalabilidad Serverless**: Firestore distribuye el contenido por defecto globalmente y no requiere manejo manual de servidores. Su escalado horizontal es ideal para picos masivos de uso sin la fricción del _Connection Pooling_ tradicional de SQL Server o PostgreSQL.

4. **Operaciones Geo-optimizadas**: Las lecturas en Firestore están construidas con latencia mínima, perfecto para leer coordenadas y renderizarlas en un mapa.

---

##  Flujo de "Double Click Protection" y Eficiencia (Requerimiento 5)

La aplicación tiene dos capas de protección y eficiencia implementadas:

1. **Double Click Protection en UI**: Mientras ocurre el fetch interno (`onSearch`), el hook de orquestación impone un flag de `isLoading`. El UI desactiva automáticamente tanto el `Input` como el `Button` impidiendo peticiones extra simultáneas si el usuario da múltiples clics accidentalmente o por impaciencia.
2. **Prevención de Gasto de API y Duplicados Críticos**: La búsqueda intercepta primero con una request en vivo (`where()`) a Firestore. Si existe un match previo exacto con el input introducido, detiene la cascada y muestra un Warning. **Nunca llega a tocar la cuota gratuita de la API de Geocoding externa**, lo que protege el rate limit. Solo llama a la API y genera la re-pintada del dom (`render`) cuando se comprueba el _cache miss_ nativo con Firestore.

---

##  Pruebas Unitarias
Se agregaron pruebas unitarias (`vitest`) para asegurar la solidez de las utilidades puras del lado del cliente. 

- `Regex robusto`: Hay pruebas exhaustivas en `validators.test.js` garantizando la detección perfecta entre un input basura versus un set de _IPv4_ y _IPv6_ válidos.
- Pruebas al componente `IpSearchBar` con React Testing Library que emulan clicks simulados interceptados gracias a `jest-dom` y mock de `SweetAlert`.
