'use client';

import { useEffect, useRef, useState } from 'react';

// Clearwater, Florida coordinates
const CLEARWATER_CENTER: [number, number] = [-82.8001, 27.9659];

export default function BackgroundWireframeMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mapInstance: any = null; // eslint-disable-line @typescript-eslint/no-explicit-any
    let isMounted = true;

    const initMap = async () => {
      try {
        console.log('Loading clean map...');
        
        // Check if component is still mounted
        if (!isMounted || !mapContainer.current) {
          return;
        }
        
        // Dynamic import to ensure client-side loading
        const maplibregl = await import('maplibre-gl');
        
        // Double-check after async operation
        if (!isMounted || !mapContainer.current) {
          return;
        }

        // High-contrast minimalist style
        const mapStyle = {
          version: 8 as const,
          sources: {
            'osm': {
              type: 'raster' as const,
              tiles: [
                'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              maxzoom: 19
            }
          },
          glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
          layers: [
            // Dark background
            {
              id: 'background',
              type: 'background' as const,
              paint: {
                'background-color': '#000000'
              }
            },
                // Standard map layer with all details
            {
              id: 'osm-base',
              type: 'raster' as const,
              source: 'osm',
              paint: {
                'raster-opacity': 1,
                'raster-fade-duration': 0
              }
            }
          ]
        };

        mapInstance = new maplibregl.Map({
          container: mapContainer.current,
          style: mapStyle,
          center: CLEARWATER_CENTER,
          zoom: 14,
          minZoom: 8,
          maxZoom: 19,
          attributionControl: false,
          interactive: true,
          doubleClickZoom: true,
          scrollZoom: true,
          dragPan: true,
          keyboard: true,
          touchZoomRotate: true,
          renderWorldCopies: true
        });

        // Add navigation controls for better interaction
        mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right');

        mapInstance.on('load', () => {
          console.log('✅ Clean map loaded successfully');
          if (isMounted) {
            setMapLoaded(true);
            setError(null);
            console.log('✅ Map state updated: mapLoaded = true');
          }
        });

        mapInstance.on('error', (e: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          console.error('Map error details:', {
            message: e.error?.message || e.message || 'Unknown error',
            type: e.type,
            error: e.error,
            fullEvent: e
          });
          if (isMounted) {
            const errorMsg = e.error?.message || e.message || JSON.stringify(e) || 'Unknown map error';
            setError(`Map error: ${errorMsg}`);
          }
        });

      } catch (err) {
        console.error('Error initializing map:', err);
        if (isMounted) {
          setError(`Failed to initialize: ${err}`);
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (e) {
          console.warn('Error removing map:', e);
        }
      }
    };
  }, []);

  return (
    <div 
      className="absolute inset-0 w-full h-full"
      style={{ 
        zIndex: 2,
        pointerEvents: mapLoaded ? 'auto' : 'none' // Enable interaction when loaded
      }}
    >
      <div 
        ref={mapContainer} 
        className="w-full h-full"
                  style={{
          opacity: mapLoaded ? 1 : 0,
          transform: 'translateZ(0)', // Force hardware acceleration
          backfaceVisibility: 'hidden',
          imageRendering: 'auto',
          filter: 'grayscale(1) contrast(1.2) brightness(0.9) invert(1)' // Black and white adjustment layer
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