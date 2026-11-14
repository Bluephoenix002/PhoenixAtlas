import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Search, RotateCcw, Palette, Compass, Layers, CheckCircle2, AlertCircle, Globe } from 'lucide-react';
import { MAP_THEMES } from './mapThemes';
import { CountryInfo, COUNTRIES_DATABASE, getCountryByISO } from '../data/countriesData';
import { geojsonCache } from '../utils/geojsonCache';
import { sounds } from '../utils/soundEngine';

interface WorldMapViewProps {
  selectedCountry: CountryInfo | null;
  onSelectCountry: (country: CountryInfo) => void;
  theme: string;
  onChangeTheme: (theme: string) => void;
  onSwitchToGlobe?: () => void;
  // Interactive quiz integration props
  isQuizMode?: boolean;
  quizPrompt?: string;
  targetFeatureId?: string;
  onQuizFeatureSelected?: (featureId: string, featureName: string) => void;
  quizFeedback?: 'correct' | 'incorrect' | null;
}

export const WorldMapView: React.FC<WorldMapViewProps> = ({
  selectedCountry,
  onSelectCountry,
  theme,
  onChangeTheme,
  onSwitchToGlobe,
  isQuizMode = false,
  quizPrompt,
  targetFeatureId,
  onQuizFeatureSelected,
  quizFeedback
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const islandPinsLayerRef = useRef<L.LayerGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CountryInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredCountryName, setHoveredCountryName] = useState<string | null>(null);

  const currentTheme = MAP_THEMES[theme] || MAP_THEMES.slate;

  // Initialize offline Leaflet map with continuous Pacific scrolling
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Zero online tiles — continuous horizontal vector canvas across the Pacific Ocean
    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 7,
      worldCopyJump: true,
      zoomControl: false,
      attributionControl: false
    });

    // Add zoom control in top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;

    // Load authentic local TopoJSON/GeoJSON
    geojsonCache
      .fetchGeoJSON('/maps/world/countries.geojson')
      .then((geoData: any) => {
        const geoLayer = L.geoJSON(geoData, {
          style: (feature) => {
            const iso2 = feature?.properties?.ISO_A2 || feature?.properties?.iso_a2;
            const isSelected = selectedCountry?.id === iso2;
            return {
              fillColor: isSelected ? currentTheme.selectedLandFill : currentTheme.defaultLandFill,
              weight: currentTheme.strokeWidth,
              opacity: 1,
              color: isSelected ? currentTheme.selectedStroke : currentTheme.landStroke,
              fillOpacity: 1
            };
          },
          onEachFeature: (feature, layer) => {
            const props = feature.properties || {};
            const iso2 = props.ISO_A2 || props.iso_a2;
            const name = props.NAME || props.name || 'Unknown Country';

            layer.on({
              mouseover: (e) => {
                const target = e.target as L.Path;
                if (!isQuizMode) {
                  setHoveredCountryName(name);
                }
                if (selectedCountry?.id !== iso2) {
                  target.setStyle({
                    fillColor: currentTheme.hoverLandFill,
                    color: currentTheme.hoverStroke,
                    weight: currentTheme.strokeWidth + 0.8
                  });
                }
              },
              mouseout: (e) => {
                const target = e.target as L.Path;
                if (!isQuizMode) {
                  setHoveredCountryName(null);
                }
                if (selectedCountry?.id !== iso2) {
                  geoLayer.resetStyle(target);
                }
              },
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                sounds.playTap();

                if (isQuizMode && onQuizFeatureSelected) {
                  onQuizFeatureSelected(iso2, name);
                  return;
                }

                const cInfo = getCountryByISO(iso2);
                if (cInfo) {
                  onSelectCountry(cInfo);
                } else {
                  // Fallback info from GeoJSON properties
                  onSelectCountry({
                    id: iso2 || 'XX',
                    iso3: props.ISO_A3 || 'XXX',
                    name: name,
                    nativeName: name,
                    capital: 'N/A',
                    continent: (props.CONTINENT as CountryInfo['continent']) || 'Europe',
                    subregion: props.SUBREGION || 'Global',
                    population: props.POP_EST || 1000000,
                    areaKm2: 50000,
                    lat: 0,
                    lng: 0,
                    languages: ['Official Language'],
                    currencies: ['Local Currency'],
                    flagEmoji: '🌐',
                    facts: [`${name} is recognized in Natural Earth global geographical datasets.`]
                  });
                }

                // Fly or zoom smoothly to country
                const bounds = (layer as L.Polygon).getBounds();
                if (bounds.isValid()) {
                  map.fitBounds(bounds, {
                    maxZoom: 5,
                    padding: [50, 50],
                    animate: true,
                    duration: 0.8
                  });
                }
              }
            });
          }
        }).addTo(map);

        geoJsonLayerRef.current = geoLayer;

        // Render dedicated interactive pins for microstates & small island nations
        const islandGroup = L.layerGroup();
        const microstates = Object.values(COUNTRIES_DATABASE).filter(
          (c) =>
            c.areaKm2 < 15000 ||
            [
              'SG', 'BH', 'MT', 'MV', 'MU', 'SC', 'CV', 'ST', 'KM', 'TV', 'NR', 'PW', 'FM', 'MH', 'KI',
              'WS', 'TO', 'VU', 'FJ', 'SB', 'KN', 'DM', 'LC', 'BB', 'VC', 'GD', 'AG', 'TT', 'MC', 'VA',
              'SM', 'AD', 'LI', 'LU', 'CY'
            ].includes(c.id)
        );

        microstates.forEach((micro) => {
          const marker = L.circleMarker([micro.lat, micro.lng], {
            radius: 5,
            fillColor: '#38bdf8',
            color: '#ffffff',
            weight: 1.5,
            opacity: 0.95,
            fillOpacity: 0.85
          });

          marker.bindTooltip(
            `<b>${micro.flagEmoji} ${micro.name}</b><br/><span style="color:#94a3b8;font-size:11px">Capital: ${micro.capital}</span>`,
            {
              direction: 'top',
              offset: [0, -5],
              className: 'leaflet-atlas-tooltip'
            }
          );

          marker.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            sounds.playTap();
            onSelectCountry(micro);
            map.setView([micro.lat, micro.lng], 5, { animate: true });
          });

          marker.addTo(islandGroup);
        });

        islandGroup.addTo(map);
        islandPinsLayerRef.current = islandGroup;

        setMapLoaded(true);
      })
      .catch((err) => {
        console.error('GeoJSON load error:', err);
      });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      islandPinsLayerRef.current = null;
    };
  }, []);

  // Update styles when theme or selection changes
  useEffect(() => {
    if (!geoJsonLayerRef.current) return;

    geoJsonLayerRef.current.eachLayer((layer: any) => {
      const props = layer.feature?.properties || {};
      const iso2 = props.ISO_A2 || props.iso_a2;
      const isSelected = selectedCountry?.id === iso2;
      const isTarget = isQuizMode && targetFeatureId === iso2;

      let fillColor = currentTheme.defaultLandFill;
      let strokeColor = currentTheme.landStroke;
      let strokeWidth = currentTheme.strokeWidth;

      if (isSelected) {
        fillColor = currentTheme.selectedLandFill;
        strokeColor = currentTheme.selectedStroke;
        strokeWidth = currentTheme.strokeWidth + 1;
      }

      if (isQuizMode && quizFeedback) {
        if (isTarget && quizFeedback === 'correct') {
          fillColor = currentTheme.correctLandFill;
          strokeColor = '#10b981';
          strokeWidth = 2;
        } else if (isSelected && quizFeedback === 'incorrect') {
          fillColor = currentTheme.errorLandFill;
          strokeColor = '#ef4444';
          strokeWidth = 2;
        }
      }

      layer.setStyle({
        fillColor,
        color: strokeColor,
        weight: strokeWidth,
        fillOpacity: 1
      });
    });
  }, [selectedCountry, theme, isQuizMode, targetFeatureId, quizFeedback, currentTheme]);

  // Handle Search Input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const q = query.toLowerCase();
    const matches = Object.values(COUNTRIES_DATABASE).filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q) ||
        c.id.toLowerCase() === q
    );
    setSearchResults(matches.slice(0, 6));
  };

  const handleSelectSearchResult = (c: CountryInfo) => {
    onSelectCountry(c);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    sounds.playTap();

    if (mapInstanceRef.current && geoJsonLayerRef.current) {
      let foundLayer: L.Polygon | null = null;
      geoJsonLayerRef.current.eachLayer((layer: any) => {
        const iso2 = layer.feature?.properties?.ISO_A2 || layer.feature?.properties?.iso_a2;
        if (iso2 === c.id) {
          foundLayer = layer;
        }
      });

      if (foundLayer) {
        const bounds = (foundLayer as L.Polygon).getBounds();
        mapInstanceRef.current.fitBounds(bounds, {
          maxZoom: 5,
          padding: [50, 50],
          animate: true,
          duration: 0.8
        });
      } else {
        mapInstanceRef.current.setView([c.lat, c.lng], 4, { animate: true });
      }
    }
  };

  const handleResetView = () => {
    sounds.playTap();
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([20, 0], 2, { animate: true });
    }
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{ backgroundColor: currentTheme.oceanBg }}
    >
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Search & Actions Bar */}
      <div className="absolute top-3 inset-x-3 sm:inset-x-auto sm:left-4 sm:w-80 z-20 pointer-events-auto">
        <div className="relative">
          <div className="flex items-center gap-2 bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-2 shadow-xl">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search world countries or capitals..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearching && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-800">
              {searchResults.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectSearchResult(c)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/80 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{c.flagEmoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-sky-400 transition-colors">
                        {c.name}
                      </p>
                      <p className="text-[11px] text-slate-400">Capital: {c.capital}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{c.continent}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View Switcher: Flat Map vs 3D Globe */}
      {onSwitchToGlobe && (
        <div className="absolute top-3 right-3 sm:right-4 z-20 pointer-events-auto flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1 backdrop-blur-md shadow-xl text-xs font-bold">
          <button
            className="px-3 py-1.5 rounded-xl bg-sky-500 text-white shadow-md transition-all flex items-center gap-1.5"
          >
            <span>🗺️ Flat</span>
          </button>
          <button
            onClick={() => {
              sounds.playTap();
              onSwitchToGlobe();
            }}
            className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <span>🌍 3D Globe</span>
          </button>
        </div>
      )}

      {/* Quiz Banner if in Map Quiz Mode */}
      {isQuizMode && quizPrompt && (
        <div className="absolute top-16 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-20 pointer-events-auto">
          <div className="bg-slate-900/95 border border-sky-500/50 rounded-2xl px-5 py-3 shadow-2xl backdrop-blur-md flex items-center gap-3 max-w-md mx-auto">
            <Compass className="w-5 h-5 text-sky-400 animate-spin-slow shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-sky-400 font-semibold uppercase tracking-wider">Map Challenge</p>
              <p className="text-sm font-bold text-white">{quizPrompt}</p>
            </div>
            {quizFeedback === 'correct' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
            )}
            {quizFeedback === 'incorrect' && (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
            )}
          </div>
        </div>
      )}

      {/* Floating Map Utility Controls */}
      <div className="absolute bottom-20 md:bottom-6 left-4 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={handleResetView}
          className="p-2.5 rounded-xl bg-slate-900/85 hover:bg-slate-800/95 text-slate-200 hover:text-white border border-slate-700/80 shadow-lg backdrop-blur-md transition-all active:scale-95 flex items-center gap-2 text-xs font-medium"
          title="Reset View to Global Map"
        >
          <RotateCcw className="w-4 h-4 text-sky-400" />
          <span className="hidden sm:inline">Reset View</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2.5 rounded-xl bg-slate-900/85 hover:bg-slate-800/95 text-slate-200 hover:text-white border border-slate-700/80 shadow-lg backdrop-blur-md transition-all active:scale-95 flex items-center gap-2 text-xs font-medium"
            title="Change Map Styling Theme"
          >
            <Palette className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Theme</span>
          </button>

          {showThemeMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-44 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl p-1.5 space-y-1">
              {Object.values(MAP_THEMES).map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onChangeTheme(t.id);
                    setShowThemeMenu(false);
                    sounds.playTap();
                  }}
                  className={`w-full px-3 py-1.5 text-xs text-left rounded-lg transition-colors flex items-center justify-between ${
                    theme === t.id
                      ? 'bg-sky-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{t.name}</span>
                  <span
                    className="w-3 h-3 rounded-full border border-slate-600"
                    style={{ backgroundColor: t.defaultLandFill }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hovered Country Capsule Indicator */}
      {hoveredCountryName && !selectedCountry && (
        <div className="absolute bottom-20 md:bottom-6 right-4 z-20 pointer-events-none">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-medium text-slate-200 backdrop-blur-sm shadow-md animate-in fade-in duration-100">
            {hoveredCountryName}
          </div>
        </div>
      )}

      {/* Loading Vector Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <Compass className="w-8 h-8 text-sky-400 animate-spin" />
          <p className="mt-3 text-xs font-medium text-slate-300">Loading offline vector cartography...</p>
        </div>
      )}
    </div>
  );
};
