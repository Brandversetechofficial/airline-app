import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [time, setTime] = useState('');
  const [flights, setFlights] = useState([]);
  const [miles, setMiles] = useState(0);
  const [countries, setCountries] = useState(0);

  // Clock Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Animate Stats Effect
  useEffect(() => {
    // Miles
    let startMiles = 0;
    const endMiles = 1500000;
    const duration = 2000;
    const stepMiles = (timestamp) => {
      if (!startMiles) startMiles = timestamp;
      const progress = Math.min((timestamp - startMiles) / duration, 1);
      setMiles(Math.floor(progress * endMiles));
      if (progress < 1) window.requestAnimationFrame(stepMiles);
    };
    window.requestAnimationFrame(stepMiles);

    // Countries
    let startCountries = 0;
    const endCountries = 195;
    const stepCountries = (timestamp) => {
      if (!startCountries) startCountries = timestamp;
      const progress = Math.min((timestamp - startCountries) / duration, 1);
      setCountries(Math.floor(progress * endCountries));
      if (progress < 1) window.requestAnimationFrame(stepCountries);
    };
    window.requestAnimationFrame(stepCountries);
  }, []);

  const [cryptoPrice, setCryptoPrice] = useState("Loading...");

  // Real-Time Crypto (CoinGecko - Free Tier)
  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        const btcPrice = data.bitcoin.usd;
        // Making $PYSH 10% of BTC for the "Real" feel
        setCryptoPrice(`$${(btcPrice * 0.1).toLocaleString()}`);
      } catch (error) {
        setCryptoPrice("$5,420.69"); // Fallback
      }
    };
    fetchCrypto();
    const interval = setInterval(fetchCrypto, 60000); // Every minute
    return () => clearInterval(interval);
  }, []);

  // Real-Time Weather (Open-Meteo - No Key Needed)
  const fetchWeather = async (lat, lon) => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const data = await res.json();
      return `${data.current_weather.temperature}°C`;
    } catch (e) {
      return "25°C"; // Fallback
    }
  };

  // Live Flights with Real Weather
  useEffect(() => {
    const cityData = [
      { name: "Bangkok (BKK)", lat: 13.7563, lon: 100.5018 },
      { name: "London (LHR)", lat: 51.5074, lon: -0.1278 },
      { name: "Paris (CDG)", lat: 48.8566, lon: 2.3522 },
      { name: "Singapore (SIN)", lat: 1.3521, lon: 103.8198 },
      { name: "Rome (FCO)", lat: 41.9028, lon: 12.4964 },
      { name: "Bali (DPS)", lat: -8.4095, lon: 115.1889 },
      { name: "Istanbul (IST)", lat: 41.0082, lon: 28.9784 },
      { name: "Seoul (ICN)", lat: 37.5665, lon: 126.9780 }
    ];

    const generateFlights = async () => {
      const newFlights = [];

      // Fetch weather for all cities in parallel
      const weatherPromises = cityData.map(async (city) => {
        const temp = await fetchWeather(city.lat, city.lon);
        return { ...city, weather: temp };
      });

      const citiesWithWeather = await Promise.all(weatherPromises);

      for (let i = 0; i < 6; i++) {
        const city = citiesWithWeather[Math.floor(Math.random() * citiesWithWeather.length)];
        newFlights.push({
          id: i,
          flight: `PYSH-${100 + i}`,
          origin: "Toronto (YYZ)",
          dest: city.name,
          time: "ON TIME",
          status: "WAITING FOR VIP",
          weather: city.weather
        });
      }
      setFlights(newFlights);
    };

    generateFlights();
    const flightTimer = setInterval(generateFlights, 60000); // Update every minute
    return () => clearInterval(flightTimer);
  }, []);

  const [origin, setOrigin] = useState("Toronto");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");

  // Search Handlers
  const handleSearch = (engine) => {
    if (!destination) {
      alert("Please specify a destination, Captain.");
      return;
    }

    let url = '';
    const encodedOrigin = encodeURIComponent(origin);
    const encodedDest = encodeURIComponent(destination);

    switch (engine) {
      case 'google':
        // Google Flights
        url = `https://www.google.com/travel/flights?q=Flights+to+${encodedDest}+from+${encodedOrigin}+on+${travelDate}`;
        window.open(url, '_blank');
        break;
      case 'kayak':
        // Kayak - Smart Text Search
        url = `https://www.kayak.com/flights/${encodedOrigin}-${encodedDest}/${travelDate}`;
        window.open(url, '_blank');
        break;
      case 'expedia':
        // Expedia
        url = `https://www.expedia.com/Flights-Search?flight-type=oneway&mode=search&trip=oneway&leg1=from:${encodedOrigin},to:${encodedDest},departure:${travelDate}&passengers=children:0,adults:1`;
        window.open(url, '_blank');
        break;
      case 'all':
        // Open Google and Kayak
        // We need a slight delay or just open multiple windows. Browsers might block the second one.
        {
          const googleUrl = `https://www.google.com/travel/flights?q=Flights+to+${encodedDest}+from+${encodedOrigin}+on+${travelDate}`;
          const kayakUrl = `https://www.kayak.com/flights/${encodedOrigin}-${encodedDest}/${travelDate}`;
          window.open(googleUrl, '_blank');
          setTimeout(() => window.open(kayakUrl, '_blank'), 500);
        }
        break;
      default:
        return;
    }
  };

  // Destination Data
  const destinationData = [
    {
      city: "Bangkok",
      image: "/memories/family_pho.jpg",
      title: "Bangkok: The Tuk-Tuk Tale",
      memory: "\"The time you negotiated a Tuk-Tuk race for the whole family! Mrs. Sharma held the bags, the kids cheered, and you navigated traffic like a local King.\""
    },
    {
      city: "Paris",
      image: "/memories/family_drinks.jpg",
      title: "Paris: The Cafe Chronicle",
      memory: "\"Remember when Mrs. Sharma found that perfect crepe spot near the Eiffel Tower? You navigated the metro like a local while the kids chased pigeons. Classic.\""
    },
    {
      city: "Tokyo",
      image: "/memories/dad_metro.jpg",
      title: "Tokyo: The Sushi Saga",
      memory: "\"Legend has it you're still the Chopstick Champion of Shibuya. The kids were amazed by the lights, but you were busy negotiating the best deals in Akihabara.\""
    },
    {
      city: "New York",
      image: "/memories/dad_train.jpg",
      title: "New York: Taming the Apple",
      memory: "\"Walking Central Park with the family in tow. You showed the kids where the real business happens on Wall Street, while Mrs. Sharma conquered 5th Avenue.\""
    },
    {
      city: "Istanbul",
      image: "/memories/dad_dog.jpg",
      title: "Istanbul: The Bosphorus Baron",
      memory: "\"Sipping tea on the Europe side, looking at Asia. You explained the history of empires to the kids while Mrs. Sharma found the best spices in the Grand Bazaar.\""
    },
    {
      city: "Seoul",
      image: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=800&q=80",
      title: "Seoul: K-Pop King",
      memory: "\"Gangnam Style was cool, but your barbecue skills were the real hit. The family explored ancient palaces, and you navigated the subway system better than the locals.\""
    }
  ];

  const handleQuickSearch = (city) => {
    setDestination(city);
    // Slight delay to allow state to update, or just pass directly
    // Using direct pass for reliability inside the handler
    handleSearch('all', city);
  };

  return (
    <>
      {/* Real-Time Crypto Ticker */}
      <div className="ticker-wrap">
        <div className="ticker">
          <div className="ticker__item">Breaking News: Europe AND Asia are fighting for Mr. Sharma's attention! 🌍</div>
          <div className="ticker__item">Crypto Update: $PYSH Coin Live Price: {cryptoPrice} 🚀</div>
          <div className="ticker__item">Family Update: Mrs. Sharma is packing for a World Tour! 🌏✈️</div>
          <div className="ticker__item">Weather Update: Real-time temperatures from across the globe ☀️</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">Piyush Air <span className="logo-badge">Private & Exclusive</span></div>
        <ul className="nav-links">
          <li><a href="#live-board">🔴 Live Status</a></li>
          <li><a href="#stats">Legend Stats</a></li>
          <li><a href="#destinations">Family Tales</a></li>
          <li><a href="#book" className="nav-cta">Find Deals</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div className="hero-badge">Verified Legend • Canada's Pride 🇨🇦</div>
          <h1>The World Awaits,<br />Mr. Piyush Sharma.</h1>
          <p>From the bustling streets of Bangkok to the cafes of Paris. The East and West are calling. Mrs. Sharma and the kids are ready for the ultimate tour.</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#book" className="cta-button">Compare Flight Prices</a>
            <button onClick={() => handleQuickSearch("Everywhere")} className="cta-button" style={{ background: 'transparent', border: '2px solid #fff' }}>
              Explore Anywhere 🌍
            </button>
          </div>
        </div>
        <div className="hero-overlay"></div>
      </header>

      {/* Stats Section */}
      <section id="stats" className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">{miles.toLocaleString()}</div>
            <div className="stat-label">Family Miles</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{countries}</div>
            <div className="stat-label">Nations Conquered</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{cryptoPrice}</div>
            <div className="stat-label">$PYSH Live Value</div>
          </div>
        </div>
      </section>

      {/* Live Flight Board */}
      <section id="live-board" className="live-board-section">
        <div className="board-header">
          <h2>🔴 Live Jet Status</h2>
          <div className="live-clock">{time}</div>
        </div>
        <div className="flight-table-container">
          <table className="flight-table">
            <thead>
              <tr>
                <th>Flight</th>
                <th>Origin (Home)</th>
                <th>Destination</th>
                <th>Time</th>
                <th>Status</th>
                <th>Weather</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((f) => (
                <tr key={f.id}>
                  <td>{f.flight}</td>
                  <td>{f.origin}</td>
                  <td>{f.dest}</td>
                  <td style={{ color: '#0f0' }}>{f.time}</td>
                  <td className="flight-status-on-time">{f.status}</td>
                  <td>{f.weather}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="features">
        <div className="section-header">
          <h2>The Sharma Family Standard</h2>
          <p>Setting the bar for Canadian travelers everywhere.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon">👑</div>
            <h3>Head of the Table</h3>
            <p>Wherever you sit is First Class. Mrs. Sharma approves.</p>
          </div>
          <div className="feature-card">
            <div className="icon">🍁</div>
            <h3>Canadian Legend</h3>
            <p>Representing the True North, strong and free, across the globe.</p>
          </div>
          <div className="feature-card">
            <div className="icon">👨‍👩‍👧‍👦</div>
            <h3>Family First</h3>
            <p>Adventures aren't complete without the whole crew.</p>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section id="destinations" className="destinations">
        <h2>Legendary Family Tales</h2>
        <div className="destination-grid">
          {destinationData.map((dest, index) => (
            <div key={index} className="destination-card">
              <img src={dest.image} alt={dest.city} />
              <div className="card-content">
                <h3>{dest.title}</h3>
                <p style={{ fontSize: '1rem', marginTop: '0.5rem', fontStyle: 'italic', marginBottom: '1rem' }}>
                  {dest.memory}
                </p>
                <button
                  onClick={() => handleQuickSearch(dest.city)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                >
                  🚀 Scan Flights to {dest.city}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section id="book" className="booking-section">
        <div className="booking-container">
          <h2>Smart Price Scanner 📉</h2>
          <p style={{ marginBottom: '2rem', color: '#94a3b8' }}>
            Compare prices across the top 3 global engines instantly. Don't let the airlines overcharge you, Sir.
          </p>
          <div className="booking-form">
            <div className="form-group">
              <label htmlFor="from">Departing From</label>
              <input
                type="text"
                id="from"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="City (e.g. Toronto)"
              />
            </div>
            <div className="form-group">
              <label htmlFor="to">Flying To</label>
              <input
                type="text"
                id="to"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="City (e.g. Delhi)"
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">When?</label>
              <input
                type="date"
                id="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => handleSearch('all')}
                className="submit-btn"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}
              >
                🚀 SCAN ALL
              </button>
              <button
                type="button"
                onClick={() => handleSearch('google')}
                className="submit-btn"
                style={{ background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)', color: '#fff' }}
              >
                Scan Google ✈️
              </button>
              <button
                type="button"
                onClick={() => handleSearch('kayak')}
                className="submit-btn"
                style={{ background: 'linear-gradient(135deg, #FF690F 0%, #ff4d00 100%)', color: '#fff' }}
              >
                Scan Kayak 🚤
              </button>
              <button
                type="button"
                onClick={() => handleSearch('expedia')}
                className="submit-btn"
                style={{ background: 'linear-gradient(135deg, #00355f 0%, #002545 100%)', color: '#fff' }}
              >
                Scan Expedia 🏨
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">Piyush Air 🍁</div>
          <div className="footer-info">
            <p>Exclusively for Mr. Piyush Sharma.</p>
            <p>&copy; 2024. Keep Exploring, Sir!</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
