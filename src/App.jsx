import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  const position = [19.4326, -99.1332]; // Mexico City

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Izzi Testing App</h1>
        <p>A Single Page Application featuring React, Firebase, and Leaflet Maps.</p>
      </header>
      <main className="map-wrapper">
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%", zIndex: 1 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              Central Location in Mexico City.
            </Popup>
          </Marker>
        </MapContainer>
      </main>
    </div>
  );
}

export default App;
