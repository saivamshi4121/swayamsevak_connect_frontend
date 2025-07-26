import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';

// Fix default marker icon issue with Leaflet in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const UserMarker = ({ position }) => (
  <Marker position={position} icon={L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // user icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })}>
    <Popup>You are here</Popup>
  </Marker>
);

const MapCenterer = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 13);
  }, [position, map]);
  return null;
};

const ShakhaLocator = () => {
  const [shakhas, setShakhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const mapRef = useRef();
  const { user } = useAuth();

  useEffect(() => {
    const fetchShakhas = async () => {
      setLoading(true);
      try {
        const res = await api.get('/shakhas');
        setShakhas(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load shakhas');
        setLoading(false);
      }
    };
    fetchShakhas();
  }, []);

  // Real-time updates with Socket.io
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    socket.on('shakha:created', shakha => {
      setShakhas(prev => [shakha, ...prev]);
    });
    socket.on('shakha:updated', updated => {
      setShakhas(prev => prev.map(s => s._id === updated._id ? updated : s));
    });
    socket.on('shakha:deleted', ({ _id }) => {
      setShakhas(prev => prev.filter(s => s._id !== _id));
    });
    return () => socket.disconnect();
  }, []);

  // Center map on India by default
  const mapCenter = [22.5937, 78.9629];
  const mapZoom = 5;

  const isMember = (shakha) => Array.isArray(shakha.members) && shakha.members.includes(user?.id);

  const handleLocateMe = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
          setLocating(false);
        },
        () => setLocating(false)
      );
    } else {
      setLocating(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-3">Shakha Locator</h2>
      <div className="mb-3 d-flex align-items-center gap-2">
        <button className="btn btn-secondary btn-sm" onClick={handleLocateMe} disabled={locating}>
          {locating ? 'Locating...' : 'Locate Me'}
        </button>
        {userLocation && <span className="text-success small">Location found!</span>}
      </div>
      {loading ? (
        <div>Loading shakhas...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card shadow-sm mb-3">
              <div className="card-body p-2" style={{height: 400}}>
                <MapContainer center={userLocation || mapCenter} zoom={userLocation ? 13 : mapZoom} style={{height: '100%', width: '100%'}} ref={mapRef}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  {userLocation && <UserMarker position={userLocation} />}
                  {userLocation && <MapCenterer position={userLocation} />}
                  {shakhas.map(shakha => (
                    <Marker key={shakha._id} position={[shakha.location.lat, shakha.location.lng]}>
                      <Popup>
                        <strong>{shakha.name}</strong><br/>
                        {shakha.region} | {shakha.category}<br/>
                        Schedule: {shakha.schedule}<br/>
                        <button className={`btn btn-sm ${isMember(shakha) ? 'btn-success' : 'btn-primary'} mt-2`}>
                          {isMember(shakha) ? 'Leave' : 'Join'}
                        </button>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${shakha.location.lat},${shakha.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-secondary mt-2 ms-2"
                        >
                          See Location
                        </a>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="list-group">
              {shakhas.map(shakha => (
                <div className="list-group-item mb-3 rounded shadow-sm border-0" key={shakha._id} style={{background:'#fff'}}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold fs-5 mb-1">{shakha.name}</div>
                      <div className="small text-muted mb-1"><i className="bi bi-geo-alt-fill me-1" style={{color:'#FF6F00'}}></i>{shakha.region} | {shakha.category}</div>
                      <div className="small">Schedule: {shakha.schedule}</div>
                    </div>
                    <button className={`btn btn-sm ${isMember(shakha) ? 'btn-success' : 'btn-primary'}`}>
                      {isMember(shakha) ? 'Leave' : 'Join'}
                    </button>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${shakha.location.lat},${shakha.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-secondary ms-2"
                    >
                      See Location
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShakhaLocator; 