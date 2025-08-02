'use client';

import { useEffect, useRef, useState } from 'react';

// Clearwater, Florida coordinates
const CLEARWATER_CENTER: [number, number] = [-82.8001, 27.9659];

export default function BackgroundWireframeMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mapInstance: any = null;

    const initMap = async () => {
      try {
        console.log('Loading wireframe map...');
        
        // Dynamic import to ensure client-side loading
        const maplibregl = await import('maplibre-gl');
        
        if (!mapContainer.current) {
          throw new Error('Map container not found');
        }

        // High-quality wireframe style
        const wireframeStyle = {
          version: 8,
          sources: {
            'osm-raster': {
              type: 'raster',
              tiles: [
                'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              maxzoom: 19,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            // Transparent background
            {
              id: 'background',
              type: 'background',
              paint: {
                'background-color': 'rgba(0, 0, 0, 0)'
              }
            },
            // High-quality raster layer with valid MapLibre properties
            {
              id: 'osm-wireframe',
              type: 'raster',
              source: 'osm-raster',
              paint: {
                'raster-opacity': 1,
                'raster-contrast': 1,
                'raster-brightness-min': 0,
                'raster-brightness-max': 0.8,
                'raster-saturation': -1,
                'raster-fade-duration': 0
              }
            }
          ]
        };

        mapInstance = new maplibregl.Map({
          container: mapContainer.current,
          style: wireframeStyle,
          center: CLEARWATER_CENTER,
          zoom: 13,
          antialias: true,
          attributionControl: false,
          interactive: false // No interaction to avoid interfering with UI
        });

        mapInstance.on('load', () => {
          console.log('Wireframe map loaded successfully');
          setMapLoaded(true);
          setError(null);
        });

        mapInstance.on('error', (e: any) => {
          console.error('Map error:', e);
          setError(`Map error: ${e.error?.message || 'Unknown error'}`);
        });

      } catch (err) {
        console.error('Error initializing map:', err);
        setError(`Failed to initialize: ${err}`);
      }
    };

    initMap();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }} // Above black background, below UI
    >
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{
          // High-quality white wireframe filters
          filter: mapLoaded ? 'invert(1) contrast(3) brightness(1.2) saturate(0)' : 'none',
          mixBlendMode: mapLoaded ? 'screen' : 'normal',
          imageRendering: 'crisp-edges',
          opacity: mapLoaded ? 0.4 : 0 // More visible wireframe
        }}
      />
      
      {error && (
        <div className="absolute top-4 right-4 bg-red-900/80 text-red-200 p-2 rounded text-xs"
             style={{ zIndex: 9999 }}>
          {error}
        </div>
      )}
    </div>
  );
}