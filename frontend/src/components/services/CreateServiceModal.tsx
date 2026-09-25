import React, { useEffect, useState } from 'react';
import { CreateRecommendationRequest, ServiceCategory } from '../../types/localService';
import { localServiceService } from '../../services/localServiceService';
import { locationService } from '../../services/locationService';
import { LocationDto } from '../../types/location';

interface CreateServiceModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateServiceModal: React.FC<CreateServiceModalProps> = ({ onClose, onSuccess }) => {
  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<ServiceCategory>('HEALTHCARE');
  const [subcategory, setSubcategory] = useState<string>('');
  const [locationId, setLocationId] = useState<number>(0);
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [openingHours, setOpeningHours] = useState<string>('24/7 Open');
  const [rating, setRating] = useState<number>(4.8);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Service title is required.');
      return;
    }
    if (!locationId) {
      setError('Please select a location city.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const req: CreateRecommendationRequest = {
        title,
        description,
        category,
        subcategory,
        locationId,
        address,
        phone,
        website,
        openingHours,
        rating
      };
      const res = await localServiceService.createService(req);
      if (res.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to list service place.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '650px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        borderRadius: '1.25rem',
        background: '#ffffff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              📍 List a Local Place or Service
            </h2>
            <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
              Help newcomers discover essential healthcare, transport, food, grocery, ATMs, and emergency services.
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748B' }}>
            ✕
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '0.5rem', color: '#991B1B', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>Place / Service Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Ruby Hall Clinic, Hinjawadi Metro Station, D-Mart Wakad..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Category *</label>
              <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value as ServiceCategory)}>
                <option value="HEALTHCARE">🏥 Healthcare</option>
                <option value="TRANSPORT">🚇 Transport</option>
                <option value="GROCERY">🛒 Grocery & Supplies</option>
                <option value="FOOD">🍴 Food & Dining</option>
                <option value="FINANCIAL">🏦 Banks & ATMs</option>
                <option value="ESSENTIAL_SERVICES">🔧 Repairs & Services</option>
                <option value="FITNESS">💪 Gym & Fitness</option>
                <option value="EDUCATION">🎓 Education</option>
                <option value="PUBLIC_SERVICES">🏛️ Public Services</option>
                <option value="EMERGENCY">🚨 Emergency</option>
                <option value="OTHER">📍 Other</option>
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Subcategory</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Hospital, Pharmacy, Bus Terminal, Supermarket..."
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>City Location *</label>
              <select className="form-control" value={locationId} onChange={(e) => setLocationId(Number(e.target.value))}>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.city}, {loc.state} ({loc.area || 'Main'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Opening Hours</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 24/7 Open, 8:00 AM - 10:00 PM..."
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>Full Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="Building, street, landmark, area, city..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Phone Contact</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. +91 20 6649 4949"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Official Website</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://..."
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Describe services offered, emergency features, parking facilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-accent" style={{ background: '#0F766E', borderColor: '#0F766E' }}>
              {isSubmitting ? 'Publishing...' : 'Publish Service Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
