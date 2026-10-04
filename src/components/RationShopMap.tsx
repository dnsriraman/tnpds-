/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow,
  useMap 
} from '@vis.gl/react-google-maps';
import Supercluster from 'supercluster';
import { 
  Store, 
  Clock, 
  MapPin, 
  Phone, 
  Navigation, 
  Crosshair, 
  Layers, 
  Package, 
  ChevronRight,
  Maximize2,
  AlertTriangle,
  ZoomIn,
  Search,
  Filter
} from 'lucide-react';
import { RationShop } from '../types';
import { isShopOpen, calculateDistance } from '../lib/utils';
import { TN_DISTRICTS, TOTAL_SHOPS_COUNT } from '../services/shopsData';

// Map Camera & Supercluster Controller
interface ClusteredMarkersLayerProps {
  shops: RationShop[];
  selectedShop: RationShop | null;
  onSelectShop: (shop: RationShop) => void;
  userLocation?: { lat: number; lon: number } | null;
  onClusterClick?: (lat: number, lng: number, expansionZoom: number) => void;
  selectedDistrict: string | null;
}

const ClusteredMarkersLayer: React.FC<ClusteredMarkersLayerProps> = ({
  shops,
  selectedShop,
  onSelectShop,
  userLocation,
  selectedDistrict
}) => {
  const map = useMap();
  const [activeMarkerShop, setActiveMarkerShop] = useState<RationShop | null>(null);
  
  // Track bounding box and zoom from map
  const [viewport, setViewport] = useState<{ bbox: [number, number, number, number]; zoom: number }>({
    bbox: [76.0, 8.0, 80.8, 13.6],
    zoom: 7
  });

  // Pan to selected shop when selected externally
  useEffect(() => {
    if (!map || !selectedShop) return;
    map.panTo({ lat: selectedShop.latitude, lng: selectedShop.longitude });
    map.setZoom(16);
    setActiveMarkerShop(selectedShop);
  }, [map, selectedShop]);

  // Convert shops to GeoJSON points
  const points = useMemo(() => {
    return shops.map((shop) => ({
      type: 'Feature' as const,
      properties: {
        cluster: false,
        shopId: shop.id,
        shop: shop
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [shop.longitude, shop.latitude]
      }
    }));
  }, [shops]);

  // Build Supercluster spatial index
  const supercluster = useMemo(() => {
    const sc = new Supercluster({
      radius: 65,
      maxZoom: 15,
      minPoints: 2
    });
    sc.load(points);
    return sc;
  }, [points]);

  // Update viewport on map idle event
  useEffect(() => {
    if (!map) return;

    const handleIdle = () => {
      const bounds = map.getBounds();
      const zoom = map.getZoom();
      if (!bounds || zoom === undefined) return;

      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      // Small buffer to avoid pop-in
      const padLng = Math.abs(ne.lng() - sw.lng()) * 0.1;
      const padLat = Math.abs(ne.lat() - sw.lat()) * 0.1;

      const minLng = Math.max(-180, Math.min(180, sw.lng() - padLng));
      const minLat = Math.max(-85, Math.min(85, sw.lat() - padLat));
      const maxLng = Math.max(-180, Math.min(180, ne.lng() + padLng));
      const maxLat = Math.max(-85, Math.min(85, ne.lat() + padLat));

      setViewport({
        bbox: [minLng, minLat, maxLng, maxLat],
        zoom: Math.max(0, Math.min(18, Math.round(zoom)))
      });
    };

    const listener = map.addListener('idle', handleIdle);
    const boundsListener = map.addListener('bounds_changed', handleIdle);
    // Initial call
    handleIdle();

    return () => {
      google.maps.event.removeListener(listener);
      google.maps.event.removeListener(boundsListener);
    };
  }, [map]);

  // Compute clusters for current viewport
  const clusters = useMemo(() => {
    if (!supercluster) return [];
    try {
      const z = Math.max(0, Math.min(18, viewport.zoom));
      const res = supercluster.getClusters(viewport.bbox, z);
      if (res && res.length > 0) return res;
      return supercluster.getClusters([76.0, 8.0, 80.8, 13.6], 7);
    } catch (e) {
      console.warn('Supercluster getClusters warning:', e);
      try {
        return supercluster.getClusters([76.0, 8.0, 80.8, 13.6], 7);
      } catch {
        return [];
      }
    }
  }, [supercluster, viewport]);

  const handleClusterClick = useCallback(
    (clusterId: number, lat: number, lng: number) => {
      if (!map || !supercluster) return;
      const currentZoom = map.getZoom() || 7;
      let targetZoom = supercluster.getClusterExpansionZoom(clusterId);
      if (targetZoom <= currentZoom) {
        targetZoom = currentZoom + 2;
      }
      map.panTo({ lat, lng });
      map.setZoom(Math.min(targetZoom, 17));
    },
    [map, supercluster]
  );

  return (
    <>
      {/* User Location Pin */}
      {userLocation && (
        <AdvancedMarker
          position={{ lat: userLocation.lat, lng: userLocation.lon }}
          title="Your Current Location"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-blue-500/30 animate-ping absolute" />
            <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-[9px] font-black">
              YOU
            </div>
          </div>
        </AdvancedMarker>
      )}

      {/* Clusters and Shop Pins */}
      {clusters.map((cluster) => {
        const [lng, lat] = cluster.geometry.coordinates;
        const properties = cluster.properties as any;
        const isCluster = properties.cluster;

        if (isCluster) {
          const count: number = properties.point_count;
          const clusterId: number = properties.cluster_id;

          // Color scale based on density
          let badgeClass = "bg-gradient-to-br from-emerald-600 to-emerald-800 border-white text-white text-xs w-9 h-9";
          if (count >= 1000) {
            badgeClass = "bg-gradient-to-br from-emerald-950 to-emerald-800 border-amber-300 ring-4 ring-emerald-500/30 text-white font-black text-xs w-14 h-14";
          } else if (count >= 250) {
            badgeClass = "bg-gradient-to-br from-emerald-900 to-teal-800 border-emerald-200 ring-2 ring-emerald-500/20 text-white font-black text-xs w-12 h-12";
          } else if (count >= 50) {
            badgeClass = "bg-gradient-to-br from-emerald-700 to-teal-700 border-white text-white font-bold text-xs w-10 h-10";
          }

          const label = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count.toLocaleString();

          return (
            <AdvancedMarker
              key={`cluster-${clusterId}`}
              position={{ lat, lng }}
              title={`Cluster of ${count.toLocaleString()} Fair Price Shops. Click to zoom in.`}
              onClick={() => handleClusterClick(clusterId, lat, lng)}
            >
              <div 
                className={`${badgeClass} cursor-pointer rounded-full shadow-2xl flex items-center justify-center transform hover:scale-115 active:scale-95 transition-all border-2`}
              >
                <span>{label}</span>
              </div>
            </AdvancedMarker>
          );
        }

        // Individual Shop Point
        const shop: RationShop = properties.shop;
        if (!shop) return null;

        const isOpen = isShopOpen(shop.openingTime, shop.closingTime, shop.lunchStart, shop.lunchEnd);
        const isSelected = activeMarkerShop?.id === shop.id;

        return (
          <AdvancedMarker
            key={`shop-${shop.id}`}
            position={{ lat: shop.latitude, lng: shop.longitude }}
            title={`${shop.name} (${isOpen ? 'Open Now' : 'Closed'})`}
            onClick={() => {
              setActiveMarkerShop(shop);
              onSelectShop(shop);
            }}
          >
            <Pin
              background={isSelected ? '#065f46' : isOpen ? '#059669' : '#e11d48'}
              borderColor={isSelected ? '#f59e0b' : isOpen ? '#065f46' : '#9f1239'}
              glyphColor="#ffffff"
              scale={isSelected ? 1.35 : 1.05}
            />
          </AdvancedMarker>
        );
      })}

      {/* InfoWindow for Active Shop */}
      {activeMarkerShop && (
        <InfoWindow
          position={{
            lat: activeMarkerShop.latitude,
            lng: activeMarkerShop.longitude
          }}
          onCloseClick={() => setActiveMarkerShop(null)}
          pixelOffset={[0, -38]}
          maxWidth={340}
        >
          <div className="p-1 font-sans text-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                {activeMarkerShop.code}
              </span>
              {(() => {
                const isOpen = isShopOpen(
                  activeMarkerShop.openingTime,
                  activeMarkerShop.closingTime,
                  activeMarkerShop.lunchStart,
                  activeMarkerShop.lunchEnd
                );
                return (
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isOpen
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isOpen ? 'Open Now' : 'Closed'}
                  </span>
                );
              })()}
            </div>

            <h4 className="font-black text-sm text-gray-900 leading-snug mb-1">
              {activeMarkerShop.name}
            </h4>

            <p className="text-xs text-gray-500 mb-2 leading-relaxed flex items-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              <span>{activeMarkerShop.address}</span>
            </p>

            <div className="bg-gray-50 p-2.5 rounded-xl mb-2 space-y-1 text-[11px] border border-gray-100">
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hours:</span>
                </span>
                <span className="font-mono font-bold text-gray-800">
                  {activeMarkerShop.openingTime} - {activeMarkerShop.closingTime}
                </span>
              </div>
              {activeMarkerShop.phone && (
                <div className="flex items-center justify-between text-gray-600">
                  <span className="flex items-center gap-1 font-medium">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Helpline:</span>
                  </span>
                  <span className="font-mono font-bold text-gray-800">{activeMarkerShop.phone}</span>
                </div>
              )}
              {userLocation && (
                <div className="flex items-center justify-between text-gray-600 border-t border-gray-200/60 pt-1 mt-1">
                  <span>Distance:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {calculateDistance(
                      userLocation.lat,
                      userLocation.lon,
                      activeMarkerShop.latitude,
                      activeMarkerShop.longitude
                    ).toFixed(1)}{' '}
                    km
                  </span>
                </div>
              )}
            </div>

            {/* Key Commodities Glance */}
            <div className="mb-2">
              <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1">
                Commodity Ledger
              </p>
              <div className="flex flex-wrap gap-1">
                {activeMarkerShop.products.slice(0, 4).map((p) => (
                  <span
                    key={p.id}
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      p.stock > 10
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}
                  >
                    {p.name}: {p.stock} {p.unit}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
              <button
                type="button"
                onClick={() => onSelectShop(activeMarkerShop)}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-black py-2 px-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Shop Details & Stock</span>
              </button>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${activeMarkerShop.latitude},${activeMarkerShop.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-800 text-[11px] font-bold p-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1"
                title="Get Driving Directions in Google Maps"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-700" />
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

interface RationShopMapProps {
  shops: RationShop[];
  selectedShop: RationShop | null;
  onSelectShop: (shop: RationShop) => void;
  userLocation?: { lat: number; lon: number } | null;
  onRequestUserLocation?: () => void;
  selectedDistrict?: string;
  onSelectDistrict?: (district: string) => void;
  className?: string;
  height?: string | number;
}

export const RationShopMap: React.FC<RationShopMapProps> = ({
  shops,
  selectedShop,
  onSelectShop,
  userLocation,
  onRequestUserLocation,
  selectedDistrict: externalSelectedDistrict,
  onSelectDistrict,
  className = '',
  height = '560px'
}) => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const [mapType, setMapType] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [internalDistrictName, setInternalDistrictName] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const mapRef = useRef<google.maps.Map | null>(null);

  const selectedDistrictName = externalSelectedDistrict !== undefined ? externalSelectedDistrict : internalDistrictName;

  // Filter shops by district and search query
  const displayedShops = useMemo(() => {
    let result = shops;
    if (selectedDistrictName !== 'all') {
      const dist = TN_DISTRICTS.find(d => d.name === selectedDistrictName);
      if (dist) {
        result = result.filter(s => s.address.includes(dist.name) || s.code.startsWith(dist.code));
      }
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.code.toLowerCase().includes(q) || 
        s.address.toLowerCase().includes(q)
      );
    }
    return result;
  }, [shops, selectedDistrictName, searchFilter]);

  // Center on Tamil Nadu geographical center
  const defaultCenter = { lat: 11.1271, lng: 78.6569 }; // Geographic center of Tamil Nadu

  // Helper controller to handle district zooming
  const DistrictNavigator = () => {
    const map = useMap();
    useEffect(() => {
      mapRef.current = map;
    }, [map]);

    useEffect(() => {
      if (!map) return;
      if (selectedDistrictName === 'all') {
        map.panTo(defaultCenter);
        map.setZoom(7);
      } else {
        const district = TN_DISTRICTS.find(d => d.name === selectedDistrictName);
        if (district) {
          map.panTo(district.center);
          map.setZoom(12);
        }
      }
    }, [map, selectedDistrictName]);

    return null;
  };

  const handleDistrictChange = (distName: string) => {
    setInternalDistrictName(distName);
    onSelectDistrict?.(distName);
  };

  const handleFitAllTamilNadu = () => {
    setInternalDistrictName('all');
    onSelectDistrict?.('all');
    setSearchFilter('');
    if (mapRef.current) {
      mapRef.current.panTo(defaultCenter);
      mapRef.current.setZoom(7);
    }
  };

  if (!apiKey) {
    return (
      <div 
        style={{ height }}
        className="w-full bg-slate-900 rounded-3xl border border-slate-800 flex flex-col items-center justify-center p-8 text-center"
      >
        <AlertTriangle className="w-12 h-12 text-amber-400 mb-4 animate-bounce" />
        <h3 className="text-white text-lg font-black tracking-tight mb-2">Google Maps Key Missing</h3>
        <p className="text-slate-400 text-xs max-w-md mb-6 leading-relaxed">
          Please configure <code className="bg-slate-800 px-2 py-1 rounded text-amber-300 font-mono">VITE_GOOGLE_MAPS_API_KEY</code> to enable the interactive Tamil Nadu 34,935 Fair Price Network map.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border border-emerald-100/60 bg-gray-100 flex flex-col ${className}`}>
      {/* Top Map Control Bar */}
      <div className="bg-emerald-950 text-white px-5 py-3.5 border-b border-emerald-900 flex flex-wrap items-center justify-between gap-3 z-10">
        {/* Network Count Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-sm tracking-tight text-white">
                Tamil Nadu Fair Price Network
              </h4>
              <span className="bg-emerald-500 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                {displayedShops.length.toLocaleString()} SHOPS
              </span>
            </div>
            <p className="text-[11px] text-emerald-300/70 font-medium">
              Real-time clustering & live GIS status across all 38 districts
            </p>
          </div>
        </div>

        {/* District Selector & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* District Dropdown */}
          <div className="relative">
            <select
              value={selectedDistrictName}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="bg-emerald-900/90 hover:bg-emerald-800 text-white font-bold text-xs py-2 px-3.5 rounded-xl border border-emerald-700/60 outline-none cursor-pointer shadow-sm transition-all pr-8 appearance-none"
              title="Jump to a specific Tamil Nadu district"
            >
              <option value="all" className="bg-emerald-950 text-white font-bold">
                📍 All 38 Districts ({TOTAL_SHOPS_COUNT.toLocaleString()} Shops)
              </option>
              {TN_DISTRICTS.map((d) => (
                <option key={d.code} value={d.name} className="bg-emerald-950 text-white">
                  {d.name} ({d.count.toLocaleString()} Shops)
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-300 text-[10px]">
              ▼
            </div>
          </div>

          {/* Fit Whole State button */}
          <button
            onClick={handleFitAllTamilNadu}
            title="Reset map to full Tamil Nadu overview"
            className="bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all border border-emerald-700/50 flex items-center gap-1.5 active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">All TN</span>
          </button>

          {/* Toggle Satellite / Roadmap */}
          <button
            onClick={() => setMapType(prev => prev === 'roadmap' ? 'hybrid' : 'roadmap')}
            title="Toggle Satellite view"
            className="bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all border border-emerald-700/50 flex items-center gap-1.5 active:scale-95"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{mapType === 'roadmap' ? 'Satellite' : 'Roadmap'}</span>
          </button>

          {/* Locate User button */}
          {onRequestUserLocation && (
            <button
              onClick={onRequestUserLocation}
              title="Find my nearest shops"
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-lg shadow-emerald-500/10 flex items-center gap-1.5 active:scale-95"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Locate Me</span>
            </button>
          )}
        </div>
      </div>

      {/* Map Interactive Canvas */}
      <div style={{ height, width: '100%' }} className="relative flex-1">
        <APIProvider apiKey={apiKey} libraries={['marker']}>
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={defaultCenter}
            defaultZoom={7}
            mapTypeId={mapType}
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
          >
            <DistrictNavigator />
            <ClusteredMarkersLayer
              shops={displayedShops}
              selectedShop={selectedShop}
              onSelectShop={onSelectShop}
              userLocation={userLocation}
              selectedDistrict={selectedDistrictName}
            />
          </Map>
        </APIProvider>
      </div>

      {/* Bottom Map Info Footer */}
      <div className="bg-white/95 backdrop-blur-md px-6 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-gray-600">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Density & Legend:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-emerald-900 border border-amber-300 flex items-center justify-center text-[8px] text-white font-bold">1k+</div>
            <span className="text-[11px] text-gray-700">District Clusters</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 shadow-sm" />
            <span className="text-[11px] text-gray-700">Open Shop</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-600 shadow-sm" />
            <span className="text-[11px] text-gray-700">Closed Shop</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-600 shadow-sm" />
              <span className="text-[11px] text-gray-700">Your Location</span>
            </div>
          )}
        </div>

        <div className="text-[11px] text-gray-500 font-medium">
          💡 <span className="font-bold text-gray-700">Click any cluster</span> to zoom in; click any pin for hours & stock ledger.
        </div>
      </div>
    </div>
  );
};

export default RationShopMap;
