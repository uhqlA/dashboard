import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CountyData {
  name: string;
  position: [number, number];
  wetlandsArea: string;
  lastUpdated: string;
  dataSource: string;
}

interface MapProps {
  onCountySelect?: (county: CountyData) => void;
  selectedCountyName?: string;
  settings?: {
    defaultMapLayer: string;
    autoFlyToCounty: boolean;
    showCountyLabels: boolean;
  };
}

// County positions mapping (Kenyan counties)
const countyPositions: Record<string, [number, number]> = {
  'Mombasa': [-4.0435, 39.6682], 'Kwale': [-4.1737, 39.4521], 'Kilifi': [-3.5107, 39.9093],
  'Tana River': [-1.5626, 39.5357], 'Lamu': [-2.2717, 40.9020], 'Taita-Taveta': [-3.3167, 38.3667],
  'Garissa': [-0.4536, 39.6460], 'Wajir': [1.7373, 40.0581], 'Mandera': [3.9373, 41.8569],
  'Marsabit': [2.3333, 37.9833], 'Isiolo': [0.3546, 38.4847], 'Meru': [0.0476, 37.6528],
  'Tharaka-Nithi': [-0.2962, 37.7236], 'Embu': [-0.5317, 37.4506], 'Kitui': [-1.3667, 38.0167],
  'Machakos': [-1.5167, 37.2667], 'Makueni': [-2.2833, 37.8167], 'Nyandarua': [-0.6167, 36.3667],
  'Nyeri': [-0.4167, 36.9500], 'Kirinyaga': [-0.5000, 37.2833], 'Muranga': [-0.7833, 37.0333],
  'Kiambu': [-1.1667, 36.8333], 'Turkana': [3.1199, 35.5968], 'West Pokot': [1.7398, 35.2698],
  'Samburu': [1.2183, 36.8917], 'Trans Nzoia': [1.0500, 34.9500], 'Uasin Gishu': [0.5167, 35.2833],
  'Elgeyo-Marakwet': [0.8000, 35.5667], 'Nandi': [0.1833, 35.1167], 'Baringo': [0.6667, 36.0667],
  'Laikipia': [0.3606, 36.7817], 'Nakuru': [-0.2833, 36.0667], 'Narok': [-1.0833, 35.8667],
  'Kajiado': [-1.8500, 36.7833], 'Kericho': [-0.3667, 35.2833], 'Bomet': [-0.7833, 35.3333],
  'Kakamega': [0.2833, 34.7500], 'Vihiga': [0.0833, 34.7167], 'Bungoma': [0.5667, 34.5667],
  'Busia': [0.4667, 34.1167], 'Siaya': [0.0667, 34.2833], 'Kisumu': [-0.0833, 34.7667],
  'Homa Bay': [-0.5333, 34.4500], 'Migori': [-1.0667, 34.4667], 'Kisii': [-0.6833, 34.7667],
  'Nyamira': [-0.5667, 34.9333], 'Nairobi': [-1.2833, 36.8167]
};

const API_BASE_URL = 'http://localhost:3001/api';

const Map = ({ onCountySelect, selectedCountyName, settings }: MapProps) => {
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const [counties, setCounties] = useState<CountyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch counties from API
  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/counties/`);
        if (!response.ok) throw new Error('Failed to fetch counties');
        const data = await response.json();
        
        if (data.status === 'success' && data.counties) {
          // Map API counties to CountyData format with positions
          const mappedCounties: CountyData[] = data.counties.map((county: any) => {
            const cleanName = county.name.replace(/\s+County$/i, '').replace(/\s+Region$/i, '');
            const position = countyPositions[cleanName] || [-0.0236, 37.9062]; // Default to Kenya center
            return {
              name: county.name,
              position,
              wetlandsArea: 'Loading...',
              lastUpdated: new Date().toLocaleDateString(),
              dataSource: 'Jazamiti Database'
            };
          });
          setCounties(mappedCounties);
        }
      } catch (err) {
        setError('Failed to load counties from database');
        console.error('Error fetching counties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounties();
  }, []);

  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (selectedCountyName && mapRef.current && settings?.autoFlyToCounty) {
      const county = counties.find(c => c.name === selectedCountyName);
      if (county) {
        mapRef.current.flyTo(county.position, 10);
      }
    }
  }, [selectedCountyName, settings?.autoFlyToCounty]);

  // Center on Kenya with appropriate zoom for entire country
  const center: [number, number] = [-0.0236, 37.9062];
  const zoom = 6;

  return (
    <div className="h-full w-full relative">
      {/* County Selector */}
      <div className="absolute top-4 left-4 z-1000 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-3 rounded-lg shadow-lg max-w-xs">
        <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">Select County</h4>
        <select 
          ref={selectRef}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          defaultValue=""
          onChange={(e) => {
            const countyName = e.target.value;
            const selectedCounty = counties.find(c => c.name === countyName);
            if (selectedCounty && onCountySelect) {
              onCountySelect(selectedCounty);
              if (selectRef.current) {
                selectRef.current.value = '';
              }
            }
          }}
        >
          <option value="" className="text-gray-900 dark:text-white">Choose a county...</option>
          {counties.map((county) => (
            <option key={county.name} value={county.name} className="text-gray-900 dark:text-white">
              {county.name}
            </option>
          ))}
        </select>
      </div>

      <MapContainer ref={mapRef} center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked={settings?.defaultMapLayer === 'OpenStreetMap'} name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer checked={settings?.defaultMapLayer === 'Satellite'} name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.arcgis.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer checked={settings?.defaultMapLayer === 'Terrain'} name="Terrain">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            />
          </LayersControl.BaseLayer>
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default Map;