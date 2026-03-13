import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import React, { useRef, useEffect } from 'react';
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

const Map = ({ onCountySelect, selectedCountyName, settings }: MapProps) => {
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const counties: CountyData[] = [
    { name: 'Mombasa County', position: [-4.0435, 39.6682], wetlandsArea: '156 sq km', lastUpdated: 'February 18, 2026', dataSource: 'Coastal Environmental Monitoring' },
    { name: 'Kwale County', position: [-4.1737, 39.4521], wetlandsArea: '120 sq km', lastUpdated: 'February 17, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Kilifi County', position: [-3.5107, 39.9093], wetlandsArea: '85 sq km', lastUpdated: 'February 16, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Tana River County', position: [-1.5626, 39.5357], wetlandsArea: '210 sq km', lastUpdated: 'February 15, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Lamu County', position: [-2.2717, 40.9020], wetlandsArea: '95 sq km', lastUpdated: 'February 14, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Taita-Taveta County', position: [-3.3167, 38.3667], wetlandsArea: '75 sq km', lastUpdated: 'February 13, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Garissa County', position: [-0.4536, 39.6460], wetlandsArea: '1100 sq km', lastUpdated: 'February 12, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Wajir County', position: [1.7373, 40.0581], wetlandsArea: '850 sq km', lastUpdated: 'February 11, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Mandera County', position: [3.9373, 41.8569], wetlandsArea: '720 sq km', lastUpdated: 'February 10, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Marsabit County', position: [2.3333, 37.9833], wetlandsArea: '1200 sq km', lastUpdated: 'February 9, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Isiolo County', position: [0.3546, 38.4847], wetlandsArea: '650 sq km', lastUpdated: 'February 8, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Meru County', position: [0.0476, 37.6528], wetlandsArea: '180 sq km', lastUpdated: 'February 7, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Tharaka-Nithi County', position: [-0.2962, 37.7236], wetlandsArea: '95 sq km', lastUpdated: 'February 6, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Embu County', position: [-0.5317, 37.4506], wetlandsArea: '110 sq km', lastUpdated: 'February 5, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Kitui County', position: [-1.3667, 38.0167], wetlandsArea: '140 sq km', lastUpdated: 'February 4, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Machakos County', position: [-1.5167, 37.2667], wetlandsArea: '125 sq km', lastUpdated: 'February 3, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Makueni County', position: [-2.2833, 37.8167], wetlandsArea: '95 sq km', lastUpdated: 'February 2, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Nyandarua County', position: [-0.6167, 36.3667], wetlandsArea: '85 sq km', lastUpdated: 'February 1, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Nyeri County', position: [-0.4167, 36.9500], wetlandsArea: '120 sq km', lastUpdated: 'January 31, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Kirinyaga County', position: [-0.5000, 37.2833], wetlandsArea: '75 sq km', lastUpdated: 'January 30, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Muranga County', position: [-0.7833, 37.0333], wetlandsArea: '90 sq km', lastUpdated: 'January 29, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Kiambu County', position: [-1.1667, 36.8333], wetlandsArea: '65 sq km', lastUpdated: 'January 28, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Turkana County', position: [3.1199, 35.5968], wetlandsArea: '950 sq km', lastUpdated: 'January 27, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'West Pokot County', position: [1.7398, 35.2698], wetlandsArea: '180 sq km', lastUpdated: 'January 26, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Samburu County', position: [1.2183, 36.8917], wetlandsArea: '780 sq km', lastUpdated: 'January 25, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Trans Nzoia County', position: [1.0500, 34.9500], wetlandsArea: '95 sq km', lastUpdated: 'January 24, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Uasin Gishu County', position: [0.5167, 35.2833], wetlandsArea: '70 sq km', lastUpdated: 'January 23, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Elgeyo-Marakwet County', position: [0.8000, 35.5667], wetlandsArea: '85 sq km', lastUpdated: 'January 22, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Nandi County', position: [0.1833, 35.1167], wetlandsArea: '110 sq km', lastUpdated: 'January 21, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Baringo County', position: [0.6667, 36.0667], wetlandsArea: '140 sq km', lastUpdated: 'January 20, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Laikipia County', position: [0.3606, 36.7817], wetlandsArea: '160 sq km', lastUpdated: 'January 19, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Nakuru County', position: [-0.2833, 36.0667], wetlandsArea: '130 sq km', lastUpdated: 'January 18, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Narok County', position: [-1.0833, 35.8667], wetlandsArea: '220 sq km', lastUpdated: 'January 17, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Kajiado County', position: [-1.8500, 36.7833], wetlandsArea: '190 sq km', lastUpdated: 'January 16, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Kericho County', position: [-0.3667, 35.2833], wetlandsArea: '75 sq km', lastUpdated: 'January 15, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Bomet County', position: [-0.7833, 35.3333], wetlandsArea: '65 sq km', lastUpdated: 'January 14, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Kakamega County', position: [0.2833, 34.7500], wetlandsArea: '85 sq km', lastUpdated: 'January 13, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Vihiga County', position: [0.0833, 34.7167], wetlandsArea: '55 sq km', lastUpdated: 'January 12, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Bungoma County', position: [0.5667, 34.5667], wetlandsArea: '90 sq km', lastUpdated: 'January 11, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Busia County', position: [0.4667, 34.1167], wetlandsArea: '65 sq km', lastUpdated: 'January 10, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Siaya County', position: [0.0667, 34.2833], wetlandsArea: '120 sq km', lastUpdated: 'January 9, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Kisumu County', position: [-0.0833, 34.7667], wetlandsArea: '425 sq km', lastUpdated: 'January 8, 2026', dataSource: 'Lake Victoria Basin Authority' },
    { name: 'Homa Bay County', position: [-0.5333, 34.4500], wetlandsArea: '180 sq km', lastUpdated: 'January 7, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Migori County', position: [-1.0667, 34.4667], wetlandsArea: '140 sq km', lastUpdated: 'January 6, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Kisii County', position: [-0.6833, 34.7667], wetlandsArea: '70 sq km', lastUpdated: 'January 5, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Nyamira County', position: [-0.5667, 34.9333], wetlandsArea: '60 sq km', lastUpdated: 'January 4, 2026', dataSource: 'Environmental Monitoring System' },
    { name: 'Nairobi County', position: [-1.2833, 36.8167], wetlandsArea: '85 sq km', lastUpdated: 'January 3, 2026', dataSource: 'Nairobi Environmental Authority' }
  ];

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
      <div className="absolute top-4 left-4 z-[1000] bg-white p-3 rounded-lg shadow-lg border border-gray-300 max-w-xs">
        <h4 className="font-semibold text-sm mb-2">Select County</h4>
        <select 
          ref={selectRef}
          className="w-full p-2 border border-gray-300 rounded text-sm"
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
          <option value="">Choose a county...</option>
          {counties.map((county) => (
            <option key={county.name} value={county.name}>
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