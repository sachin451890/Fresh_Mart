import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export const LocationModal = () => {
  const {
    isLocationOpen,
    setIsLocationOpen,
    deliveryLocation,
    setDeliveryLocation,
    detectLocation,
    isDetectingLocation,
    showToast,
  } = useCart();

  const [searchInput, setSearchInput] = useState('');
  const [liveSuggestions, setLiveSuggestions] = useState([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [gpsError, setGpsError] = useState('');

  // Reset search and error when modal closes
  useEffect(() => {
    if (!isLocationOpen) {
      setSearchInput('');
      setGpsError('');
      setLiveSuggestions([]);
    }
  }, [isLocationOpen]);

  // Live Geocoding API lookup when typing >= 3 characters
  useEffect(() => {
    if (!isLocationOpen || !searchInput.trim() || searchInput.trim().length < 3) {
      setLiveSuggestions([]);
      setIsSearchingLive(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingLive(true);
      try {
        const query = searchInput.trim();
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=4`,
          { headers: { 'Accept-Language': 'en' } }
        );
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((item) => ({
            title: item.display_name.split(',')[0],
            loc: item.display_name,
            sub: 'Express 10-15 Min Serviceable Area',
          }));
          setLiveSuggestions(mapped);
        }
      } catch (err) {
        console.log('Live location search error:', err);
      } finally {
        setIsSearchingLive(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, isLocationOpen]);

  if (!isLocationOpen) return null;

  const popularHubs = [
    { title: '📍 Koramangala', sub: 'Bengaluru • 10-12 Mins', loc: 'Koramangala 4th Block, Bengaluru (560034)' },
    { title: '📍 Indiranagar', sub: 'Bengaluru • 12-15 Mins', loc: 'Indiranagar 100ft Road, Bengaluru (560038)' },
    { title: '📍 HSR Layout', sub: 'Bengaluru • 10-14 Mins', loc: 'HSR Layout Sector 1, Bengaluru (560102)' },
    { title: '📍 Whitefield', sub: 'Bengaluru • 15 Mins', loc: 'ITPL Main Road, Whitefield, Bengaluru (560066)' },
    { title: '📍 JP Nagar', sub: 'Bengaluru • 12 Mins', loc: 'JP Nagar 6th Phase, Bengaluru (560078)' },
    { title: '📍 Powai', sub: 'Mumbai • 10-15 Mins', loc: 'Hiranandani Gardens, Powai, Mumbai (400076)' },
    { title: '📍 Bandra West', sub: 'Mumbai • 12 Mins', loc: 'Hill Road, Bandra West, Mumbai (400050)' },
    { title: '📍 Cyber City', sub: 'Gurugram • 10-12 Mins', loc: 'DLF Phase 2, Cyber City, Gurugram (122002)' },
  ];

  const handleSelect = (loc) => {
    const formattedLoc = loc.trim();
    if (!formattedLoc) return;
    setDeliveryLocation(formattedLoc);
    localStorage.setItem('freshmart_react_location', formattedLoc);
    setIsLocationOpen(false);
    showToast(`📍 Location updated to ${formattedLoc.split(',')[0]}`);
  };

  const handleCustomSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      handleSelect(searchInput.trim());
    }
  };

  const handleGPSDetect = async () => {
    setGpsError('');
    const res = await detectLocation(true);
    if (res && res.success) {
      setIsLocationOpen(false);
    } else if (res && !res.success) {
      setGpsError('⚠️ Location is disabled on your device! Please turn ON Location / GPS in your device settings.');
    }
  };

  const filteredHubs = searchInput.trim()
    ? popularHubs.filter(h =>
        h.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        h.loc.toLowerCase().includes(searchInput.toLowerCase()) ||
        h.sub.toLowerCase().includes(searchInput.toLowerCase())
      )
    : popularHubs;

  return (
    <div className="modal-overlay open" onClick={() => setIsLocationOpen(false)}>
      <div className="modal-dialog location-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Choose Delivery Location</h3>
            <p className="modal-subtitle">Superfast 10-15 minute grocery express delivery</p>
          </div>
          <button className="modal-close-btn" onClick={() => setIsLocationOpen(false)}>✕</button>
        </div>

        <div className="modal-body">
          {/* Search box */}
          <form onSubmit={handleCustomSearch} className="location-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search area, apartment, street or pincode..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoFocus
            />
            {searchInput && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => {
                  setSearchInput('');
                  setLiveSuggestions([]);
                }}
              >
                ✕
              </button>
            )}
          </form>

          {/* Instant Custom Search Card */}
          {searchInput.trim().length > 0 && (
            <div
              className="custom-address-select-card"
              onClick={() => handleSelect(searchInput.trim())}
            >
              <span className="location-pin-icon">📍</span>
              <div className="custom-address-text">
                <strong>Deliver to "{searchInput.trim()}"</strong>
                <small>Tap to confirm & set this as active delivery address</small>
              </div>
              <button type="button" className="btn-select-address-pill">Select ✓</button>
            </div>
          )}

          {/* Automatic GPS Location Detection Button */}
          <div
            className={`current-gps-btn ${isDetectingLocation ? 'detecting' : ''}`}
            onClick={handleGPSDetect}
          >
            <span className={`gps-icon ${isDetectingLocation ? 'spin-anim' : ''}`}>
              {isDetectingLocation ? '🔄' : '🎯'}
            </span>
            <div style={{ flex: 1 }}>
              <strong>{isDetectingLocation ? 'Detecting via Browser GPS...' : 'Use Current Location (GPS)'}</strong>
              <small>{isDetectingLocation ? 'Fetching exact coordinates & reverse geocoding...' : 'Auto-detect via GPS for fastest delivery'}</small>
            </div>
            <span className="gps-arrow">›</span>
          </div>

          {gpsError && (
            <div className="gps-error-banner">
              <span>{gpsError}</span>
            </div>
          )}

          {/* Live Geocoded Suggestions */}
          {liveSuggestions.length > 0 && (
            <div className="live-suggestions-section">
              <h5>Matches Found</h5>
              <div className="live-suggestions-list">
                {liveSuggestions.map((s, idx) => (
                  <div
                    key={idx}
                    className="live-suggestion-item"
                    onClick={() => handleSelect(s.loc)}
                  >
                    <span className="item-icon">📍</span>
                    <div className="item-text">
                      <strong>{s.title}</strong>
                      <small>{s.loc}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Serviceable Express Hubs */}
          <div className="popular-hubs-section">
            <h5>Popular Delivery Hubs</h5>
            <div className="hubs-grid">
              {filteredHubs.map((hub, i) => (
                <div
                  key={i}
                  className={`hub-card ${deliveryLocation.includes(hub.title.replace('📍 ', '')) ? 'active' : ''}`}
                  onClick={() => handleSelect(hub.loc)}
                >
                  <div className="hub-card-header">
                    <strong>{hub.title}</strong>
                    <span className="badge-express">⚡ 10 MINS</span>
                  </div>
                  <p className="hub-loc">{hub.loc}</p>
                  <small className="hub-sub">{hub.sub}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
