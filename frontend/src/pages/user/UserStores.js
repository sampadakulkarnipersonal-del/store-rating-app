import React, { useEffect, useState, useCallback } from 'react';
import api from '../../utils/api';
import StarRating from '../../components/StarRating';
import { MdSearch, MdStore } from 'react-icons/md';

const RatingModal = ({ store, onClose, onDone }) => {
  const [rating, setRating] = useState(store.user_rating || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!store.user_rating;

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5.');
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/stores/${store.id}/ratings`, { rating });
      } else {
        await api.post(`/stores/${store.id}/ratings`, { rating });
      }
      onDone();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{isEdit ? 'Update Rating' : 'Rate This Store'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 20 }}>
          {store.name}
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
          {rating === 0 ? 'Click a star to rate' : `You selected: ${rating} star${rating !== 1 ? 's' : ''}`}
        </p>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || rating === 0}>
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Saving...' : isEdit ? 'Update Rating' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ field: 'name', order: 'ASC' });
  const [ratingModal, setRatingModal] = useState(null);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...search, sortBy: sort.field, order: sort.order };
      const res = await api.get('/stores', { params });
      setStores(res.data);
    } catch (err) {
      setError('Failed to load stores.');
    } finally {
      setLoading(false);
    }
  }, [search, sort]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleRatingDone = () => {
    setRatingModal(null);
    fetchStores();
  };

  return (
    <div>
      <div className="page-header">
        <h2>Browse Stores</h2>
        <p>Discover and rate stores on the platform</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="filter-bar" style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative' }}>
          <MdSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            value={search.name}
            onChange={e => setSearch(p => ({ ...p, name: e.target.value }))}
            className="form-input"
            placeholder="Search by name..."
            style={{ paddingLeft: 32 }}
          />
        </div>
        <input
          value={search.address}
          onChange={e => setSearch(p => ({ ...p, address: e.target.value }))}
          className="form-input"
          placeholder="Search by address..."
        />
        <select
          value={`${sort.field}-${sort.order}`}
          onChange={e => {
            const [field, order] = e.target.value.split('-');
            setSort({ field, order });
          }}
          className="form-input"
        >
          <option value="name-ASC">Name A–Z</option>
          <option value="name-DESC">Name Z–A</option>
          <option value="average_rating-DESC">Highest Rated</option>
          <option value="average_rating-ASC">Lowest Rated</option>
        </select>
      </div>

      {loading ? (
        <div className="page-loading"><span className="spinner" /> Loading stores...</div>
      ) : stores.length === 0 ? (
        <div className="empty-state">
          <MdStore />
          <p>No stores found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="stores-grid">
          {stores.map(store => (
            <div key={store.id} className="store-card">
              <div className="store-name">{store.name}</div>
              <div className="store-address">{store.address || 'Address not provided'}</div>

              <div className="store-rating-row">
                <div className="store-avg-rating">
                  <span className="store-avg-num">{Number(store.average_rating).toFixed(1)}</span>
                  <div>
                    <StarRating value={parseFloat(store.average_rating)} readOnly size="sm" />
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {store.total_ratings} rating{store.total_ratings !== '1' ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>

              {store.user_rating && (
                <div>
                  <div className="your-rating-label">Your Rating</div>
                  <StarRating value={store.user_rating} readOnly size="sm" />
                </div>
              )}

              <div className="store-card-actions">
                {store.user_rating ? (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setRatingModal(store)}
                  >
                    ✏️ Edit Rating
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setRatingModal(store)}
                  >
                    ★ Rate Store
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {ratingModal && (
        <RatingModal
          store={ratingModal}
          onClose={() => setRatingModal(null)}
          onDone={handleRatingDone}
        />
      )}
    </div>
  );
};

export default UserStores;
