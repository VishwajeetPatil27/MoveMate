import React, { useState, useEffect } from 'react';
import { AccommodationType, CreateAccommodationRequest, FurnishingStatus, GenderPreference } from '../../types/accommodation';
import { accommodationService } from '../../services/accommodationService';
import { locationService } from '../../services/locationService';
import { LocationDto } from '../../types/location';

interface CreateAccommodationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateAccommodationModal: React.FC<CreateAccommodationModalProps> = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<AccommodationType>('ROOM');
  const [rent, setRent] = useState<string>('');
  const [deposit, setDeposit] = useState<string>('');
  const [locationId, setLocationId] = useState<number | null>(null);
  const [availableFrom, setAvailableFrom] = useState<string>(new Date().toISOString().split('T')[0]);
  const [genderPreference, setGenderPreference] = useState<GenderPreference>('ANY');
  const [furnished, setFurnished] = useState<FurnishingStatus>('SEMI_FURNISHED');
  const [facilities, setFacilities] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    locationService.searchLocations().then(res => {
      if (res.success && res.data) {
        setLocations(res.data);
        if (res.data.length > 0) {
          setLocationId(res.data[0].id);
        }
      }
    }).catch(() => {});
  }, []);

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImageUrls(prev => [...prev, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rent || !locationId) {
      setError('Title, rent amount, and location are required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const request: CreateAccommodationRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        rent: Number(rent),
        deposit: deposit ? Number(deposit) : undefined,
        locationId,
        availableFrom,
        genderPreference,
        furnished,
        facilities: facilities.trim() || undefined,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined
      };

      const res = await accommodationService.createAccommodation(request);
      if (res.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create accommodation listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
    }}>
      <div className="modal-content glass-panel" style={{
        background: '#FFFFFF', borderRadius: '1.25rem', width: '100%', maxWidth: '650px',
        maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: 'var(--shadow-xl)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            List Your Accommodation
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748B' }}>
            &times;
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.85rem 1rem', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Listing Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Spacious 1BHK Flat near Hinjawadi IT Park"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              style={{ width: '100%' }}
            />
          </div>

          {/* Type & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Property Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AccommodationType)}
                className="input"
                style={{ width: '100%' }}
              >
                <option value="ROOM">Single Room</option>
                <option value="PG">PG (Paying Guest)</option>
                <option value="FLAT">Flat / Apartment</option>
                <option value="HOSTEL">Hostel</option>
                <option value="FLATMATE">Flatmate Needed</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Location *
              </label>
              <select
                value={locationId || ''}
                onChange={(e) => setLocationId(Number(e.target.value))}
                className="input"
                style={{ width: '100%' }}
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.city} - {loc.area}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Monthly Rent (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="12000"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                className="input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Security Deposit (₹)
              </label>
              <input
                type="number"
                placeholder="25000"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="input"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Furnishing & Gender */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Furnishing
              </label>
              <select
                value={furnished}
                onChange={(e) => setFurnished(e.target.value as FurnishingStatus)}
                className="input"
                style={{ width: '100%' }}
              >
                <option value="UNFURNISHED">Unfurnished</option>
                <option value="SEMI_FURNISHED">Semi-Furnished</option>
                <option value="FULLY_FURNISHED">Fully-Furnished</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Gender Preference
              </label>
              <select
                value={genderPreference}
                onChange={(e) => setGenderPreference(e.target.value as GenderPreference)}
                className="input"
                style={{ width: '100%' }}
              >
                <option value="ANY">Any / No Preference</option>
                <option value="MALE">Male Only</option>
                <option value="FEMALE">Female Only</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe the property, nearby landmarks, rules, or room highlights..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          {/* Facilities / Amenities */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Amenities (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. WiFi, AC, Parking, Kitchen, Geyser, Power Backup"
              value={facilities}
              onChange={(e) => setFacilities(e.target.value)}
              className="input"
              style={{ width: '100%' }}
            />
          </div>

          {/* Image URLs */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Property Photo URLs
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="input"
                style={{ flex: 1 }}
              />
              <button type="button" onClick={handleAddImage} className="btn btn-secondary">
                + Add Image
              </button>
            </div>

            {imageUrls.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {imageUrls.map((url, idx) => (
                  <span key={idx} style={{ background: '#F1F5F9', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    🖼️ Image {idx + 1}
                    <button type="button" onClick={() => handleRemoveImage(idx)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold' }}>
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#0F766E' }} disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
