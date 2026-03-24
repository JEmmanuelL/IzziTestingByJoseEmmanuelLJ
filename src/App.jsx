/**
 * App.jsx
 * --------
 * Componente raíz de la aplicación.
 * Integra todos los componentes y el hook de orquestación.
 *
 * Estructura:
 * - Header con título de la app
 * - IpSearchBar para búsquedas
 * - IpMap para visualización geográfica
 * - IpTable para el histórico de consultas
 */

import IpSearchBar from "./components/IpSearchBar/IpSearchBar";
import IpTable from "./components/IpTable/IpTable";
import IpMap from "./components/IpMap/IpMap";
import useIpSearch from "./hooks/useIpSearch";
import "./App.css";

function App() {
  const { records, selectedRecord, isLoading, handleSearch, handleDelete } =
    useIpSearch();

  return (
    <div className="app-container">
      {/* Encabezado */}
      <header className="app-header">
        <h1>🌐 IP Lookup</h1>
        <p>Consulta información de cualquier dirección IP en tiempo real</p>
      </header>

      {/* Buscador de IP */}
      <IpSearchBar onSearch={handleSearch} isLoading={isLoading} />

      {/* Mapa de geolocalización */}
      <IpMap selectedRecord={selectedRecord} />

      {/* Tabla de histórico */}
      <IpTable
        records={records}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
