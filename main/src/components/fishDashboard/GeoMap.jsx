// components/Maps/GeoMap.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Target, 
  ZoomIn, 
  ZoomOut, 
  Navigation, 
  Globe,
  Filter,
  Layers
} from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';

const GeoMap = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 20]);
  const [filters, setFilters] = useState({
    phishing: true,
    fingerprint: true,
    keystroke: true,
    evasion: true
  });

  const mapRef = useRef(null);

  useEffect(() => {
    // Simulate location data
    const mockLocations = [
      { id: 1, coordinates: [-74.006, 40.7128], type: 'phishing', count: 24, ip: '192.168.1.100' },
      { id: 2, coordinates: [-118.2437, 34.0522], type: 'fingerprint', count: 18, ip: '10.0.0.45' },
      { id: 3, coordinates: [2.3522, 48.8566], type: 'keystroke', count: 12, ip: '172.16.0.22' },
      { id: 4, coordinates: [151.2093, -33.8688], type: 'evasion', count: 5, ip: '192.168.100.1' },
      { id: 5, coordinates: [139.6917, 35.6895], type: 'phishing', count: 31, ip: '10.10.1.100' },
      { id: 6, coordinates: [-0.1276, 51.5074], type: 'fingerprint', count: 22, ip: '172.20.0.5' },
      { id: 7, coordinates: [37.6173, 55.7558], type: 'phishing', count: 15, ip: '192.168.50.10' },
      { id: 8, coordinates: [116.4074, 39.9042], type: 'keystroke', count: 9, ip: '10.1.1.50' },
    ];
    setLocations(mockLocations);
  }, []);

  const getMarkerColor = (type) => {
    switch(type) {
      case 'phishing': return '#ff003c';
      case 'fingerprint': return '#00ff41';
      case 'keystroke': return '#0080ff';
      case 'evasion': return '#bf00ff';
      default: return '#ffffff';
    }
  };

  const handleZoomIn = () => setZoom(zoom * 1.2);
  const handleZoomOut = () => setZoom(zoom / 1.2);
  const handleReset = () => {
    setZoom(1);
    setCenter([0, 20]);
  };

  const filteredLocations = locations.filter(loc => filters[loc.type]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="terminal-window p-4"
    >
      {/* Map Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-hacker-green" />
          <div>
            <h3 className="text-lg font-cyber font-bold text-white">GEOGRAPHICAL INTEL</h3>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-hacker-red mr-2"></div>
                <span className="text-gray-400">Phishing</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-hacker-green mr-2"></div>
                <span className="text-gray-400">Fingerprint</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-hacker-blue mr-2"></div>
                <span className="text-gray-400">Keystroke</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-cyber-dark border border-terminal-border"
            onClick={handleZoomIn}
          >
            <ZoomIn className="w-4 h-4 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-cyber-dark border border-terminal-border"
            onClick={handleZoomOut}
          >
            <ZoomOut className="w-4 h-4 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-cyber-dark border border-terminal-border"
            onClick={handleReset}
          >
            <Target className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-4 p-3 rounded-lg bg-cyber-dark border border-terminal-border">
        <Filter className="w-4 h-4 text-gray-400" />
        {Object.entries(filters).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setFilters(prev => ({ ...prev, [key]: !prev[key] }))}
            className={`px-3 py-1 text-xs font-mono rounded capitalize ${value ? 'bg-hacker-green/20 text-hacker-green' : 'bg-cyber-gray text-gray-400'}`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="relative h-[400px] rounded-lg overflow-hidden border border-terminal-border">
        <ComposableMap
          ref={mapRef}
          projection="geoMercator"
          projectionConfig={{ scale: 147 }}
          className="w-full h-full bg-terminal-bg"
        >
          <ZoomableGroup zoom={zoom} center={center}>
            <Geographies geography="/features.json">
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#1a1a1a"
                    stroke="#333"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { fill: '#2a2a2a', outline: 'none' },
                      pressed: { fill: '#2a2a2a', outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>
            
            {/* Markers */}
            {filteredLocations.map((location) => (
              <Marker key={location.id} coordinates={location.coordinates}>
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setSelectedLocation(location)}
                >
                  <circle
                    r={Math.min(8, location.count / 3)}
                    fill={getMarkerColor(location.type)}
                    fillOpacity={0.8}
                    stroke="#0a0a0a"
                    strokeWidth={1}
                  />
                  <circle
                    r={Math.min(8, location.count / 3) + 3}
                    fill="transparent"
                    stroke={getMarkerColor(location.type)}
                    strokeWidth={1}
                    strokeOpacity={0.3}
                  />
                </motion.g>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Pulsing center marker */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Navigation className="w-6 h-6 text-hacker-green" />
        </motion.div>

        {/* Zoom level indicator */}
        <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-terminal-header/90 backdrop-blur-sm border border-terminal-border">
          <span className="text-xs font-mono text-white">
            Zoom: {zoom.toFixed(1)}x
          </span>
        </div>
      </div>

      {/* Location Details */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 p-4 rounded-lg bg-cyber-dark border border-terminal-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <MapPin className={`w-5 h-5 ${getMarkerColor(selectedLocation.type)}`} />
                <div>
                  <div className="font-cyber font-bold text-white">
                    Location #{selectedLocation.id}
                  </div>
                  <div className="text-xs font-mono text-gray-400">
                    {selectedLocation.coordinates[1].toFixed(2)}°N, {selectedLocation.coordinates[0].toFixed(2)}°W
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-xs font-mono text-gray-400 hover:text-white"
              >
                CLOSE
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Type</div>
                <div className={`font-mono font-bold ${getMarkerColor(selectedLocation.type)}`}>
                  {selectedLocation.type.toUpperCase()}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Activity Count</div>
                <div className="font-mono font-bold text-white">
                  {selectedLocation.count}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-gray-400">IP Address</div>
                <div className="font-mono text-white">
                  {selectedLocation.ip}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Threat Level</div>
                <div className="font-mono text-hacker-green">
                  {selectedLocation.count > 20 ? 'HIGH' : selectedLocation.count > 10 ? 'MEDIUM' : 'LOW'}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-terminal-border">
              <button className="w-full py-2 text-sm font-mono bg-hacker-green/20 text-hacker-green rounded-lg hover:bg-hacker-green/30 transition-colors">
                INITIATE TRACE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Bar */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        <div className="text-center p-3 rounded-lg bg-cyber-dark">
          <div className="text-2xl font-cyber font-bold text-white">
            {locations.length}
          </div>
          <div className="text-xs font-mono text-gray-400">Locations</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-cyber-dark">
          <div className="text-2xl font-cyber font-bold text-hacker-green">
            {locations.reduce((sum, loc) => sum + loc.count, 0)}
          </div>
          <div className="text-xs font-mono text-gray-400">Total Events</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-cyber-dark">
          <div className="text-2xl font-cyber font-bold text-hacker-red">
            {locations.filter(l => l.type === 'phishing').length}
          </div>
          <div className="text-xs font-mono text-gray-400">Phishing Sources</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-cyber-dark">
          <div className="text-2xl font-cyber font-bold text-hacker-blue">
            {new Set(locations.map(l => l.ip.split('.').slice(0, 2).join('.'))).size}
          </div>
          <div className="text-xs font-mono text-gray-400">Networks</div>
        </div>
      </div>
    </motion.div>
  );
};

export default GeoMap;