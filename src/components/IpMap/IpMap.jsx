/**
 * IpMap.jsx
 * ----------
 * Componente de mapa interactivo que muestra la ubicación de la IP consultada.
 * Utiliza react-leaflet para renderizar un mapa OpenStreetMap con un marcador dinámico.
 *
 * Características:
 * - Mapa centrado en la última IP consultada
 * - Marcador con popup informativo (IP, Ciudad, País)
 * - Se actualiza automáticamente al cambiar las coordenadas
 * - Vista por defecto centrada en el mundo si no hay IP seleccionada
 *
 * Props:
 * - selectedRecord: objeto con los datos de la IP seleccionada (latitude, longitude, ip, city, country)
 *
 * Principio SOLID:
 * - Single Responsibility: solo maneja la visualización del mapa
 */

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import "./IpMap.css";

// Coordenadas por defecto (centro del mundo)
const DEFAULT_CENTER = [20, 0];
const DEFAULT_ZOOM = 2;
const SELECTED_ZOOM = 13;

/**
 * Corrige el ícono por defecto de Leaflet que no carga en bundlers como Vite/Webpack.
 * Esto es un problema conocido de Leaflet con módulos ES.
 */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/**
 * Componente interno que permite re-centrar el mapa cuando cambian las coordenadas.
 * useMap() solo funciona dentro de MapContainer.
 */
const RecenterMap = ({ latitude, longitude }) => {
  const map = useMap();

  useEffect(() => {
    if (latitude && longitude) {
      map.flyTo([latitude, longitude], SELECTED_ZOOM, {
        duration: 1.5,
      });
    }
  }, [latitude, longitude, map]);

  return null;
};

const IpMap = ({ selectedRecord = null }) => {
  const hasSelection = selectedRecord && selectedRecord.latitude && selectedRecord.longitude;
  const center = hasSelection
    ? [selectedRecord.latitude, selectedRecord.longitude]
    : DEFAULT_CENTER;
  const zoom = hasSelection ? SELECTED_ZOOM : DEFAULT_ZOOM;

  return (
    <section className="ip-map" id="ip-map">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="ip-map__container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Re-centrar el mapa cuando cambia la selección */}
        {hasSelection && (
          <RecenterMap
            latitude={selectedRecord.latitude}
            longitude={selectedRecord.longitude}
          />
        )}

        {/* Marcador de la IP seleccionada */}
        {hasSelection && (
          <Marker position={[selectedRecord.latitude, selectedRecord.longitude]}>
            <Popup>
              <strong>IP:</strong> {selectedRecord.ip}
              <br />
              <strong>Ciudad:</strong> {selectedRecord.city}
              <br />
              <strong>País:</strong> {selectedRecord.country}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Indicador si no hay IP seleccionada */}
      {!hasSelection && (
        <div className="ip-map__overlay">
          <p>📍 Busca una IP para ver su ubicación en el mapa</p>
        </div>
      )}
    </section>
  );
};

export default IpMap;
