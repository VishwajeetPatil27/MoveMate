import React, { useEffect, useState } from 'react';
import { locationService } from '../../services/locationService';
import { LocationDto } from '../../types/location';
import { MapPin, Search, Navigation, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LocationSelectorProps {
  selectedLocationId?: number | null;
  onSelectLocation: (location: LocationDto) => void;
  label?: string;
  placeholder?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocationId,
  onSelectLocation,
  label = 'Select Location',
  placeholder = 'Search city or locality...'
}) => {
  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<LocationDto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [detectedStatusMessage, setDetectedStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await locationService.searchLocations();
      if (res.success && res.data) {
        setLocations(res.data);
        setFilteredLocations(res.data);
      } else {
        setLocations([]);
        setFilteredLocations([]);
      }
    } catch (err: any) {
      setError('Unable to load locations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLocations(locations);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredLocations(
        locations.filter(
          (loc) =>
            loc.city.toLowerCase().includes(q) ||
            loc.state.toLowerCase().includes(q) ||
            (loc.area && loc.area.toLowerCase().includes(q))
        )
      );
    }
  }, [searchQuery, locations]);

  // Calculate distance using Haversine formula (km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleDetectLiveLocation = () => {
    setDetectedStatusMessage(null);

    if (!navigator.geolocation) {
      setDetectedStatusMessage('Geolocation is not supported by your browser.');
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        if (locations.length === 0) {
          setDetectedStatusMessage('Location detected, but location database is empty.');
          setDetectingLocation(false);
          return;
        }

        // Find closest city in dataset using Haversine
        let closestLocation: LocationDto | null = null;
        let minDistance = Infinity;

        locations.forEach((loc) => {
          if (loc.latitude && loc.longitude) {
            const dist = calculateDistance(userLat, userLng, Number(loc.latitude), Number(loc.longitude));
            if (dist < minDistance) {
              minDistance = dist;
              closestLocation = loc;
            }
          }
        });

        if (closestLocation) {
          onSelectLocation(closestLocation);
          setDetectedStatusMessage(`Current location detected: ${(closestLocation as LocationDto).city} (${minDistance.toFixed(1)} km away)`);
        } else {
          const fallback = locations[0];
          onSelectLocation(fallback);
          setDetectedStatusMessage(`Current location matched: ${fallback.city}`);
        }

        setDetectingLocation(false);
      },
      (geoErr) => {
        setDetectingLocation(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setDetectedStatusMessage('Location access was denied. You can select your city manually below.');
        } else if (geoErr.code === geoErr.POSITION_UNAVAILABLE) {
          setDetectedStatusMessage('Location information is unavailable. Please select your city manually.');
        } else if (geoErr.code === geoErr.TIMEOUT) {
          setDetectedStatusMessage('Location request timed out. Please select your city manually.');
        } else {
          setDetectedStatusMessage('Unable to detect location. Please select manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const selectedLoc = locations.find((l) => l.id === Number(selectedLocationId));

  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8125rem', marginBottom: '0.4rem', color: 'var(--color-text-secondary)' }}>
          {label}
        </label>
      )}

      {/* Live Geolocation Button */}
      <button
        type="button"
        onClick={handleDetectLiveLocation}
        disabled={detectingLocation}
        className="btn btn-secondary"
        style={{
          width: '100%',
          marginBottom: '0.75rem',
          border: '1px dashed var(--color-brand-accent)',
          backgroundColor: 'var(--color-brand-accent-light)',
          color: 'var(--color-brand-accent-hover)',
          fontWeight: 600,
          fontSize: '0.8125rem'
        }}
      >
        <Navigation size={15} />
        <span>{detectingLocation ? 'Detecting your coordinates...' : 'Use My Current Location'}</span>
      </button>

      {detectedStatusMessage && (
        <div style={{
          fontSize: '0.78125rem',
          color: 'var(--color-brand-accent-hover)',
          backgroundColor: 'var(--color-brand-accent-light)',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '0.75rem',
          border: '1px solid #99F6E4',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
          <span>{detectedStatusMessage}</span>
        </div>
      )}

      {/* Location Search Input & Select Dropdown */}
      {loading ? (
        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', padding: '0.5rem' }}>Loading locations...</div>
      ) : error ? (
        <div style={{ fontSize: '0.8125rem', color: '#EF4444', padding: '0.5rem' }}>⚠️ {error}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className="form-control"
              style={{
                borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                borderBottom: 'none',
                fontSize: '0.8125rem',
                paddingLeft: '2.25rem'
              }}
            />
            <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <select
            value={selectedLocationId || ''}
            onChange={(e) => {
              const id = Number(e.target.value);
              const found = locations.find((l) => l.id === id);
              if (found) {
                onSelectLocation(found);
              }
            }}
            className="form-control"
            style={{
              borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
              fontSize: '0.875rem'
            }}
          >
            <option value="">{selectedLoc ? selectedLoc.displayName : '-- Select City or Locality --'}</option>
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.displayName}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No matching locations found
              </option>
            )}
          </select>
        </div>
      )}
    </div>
  );
};
