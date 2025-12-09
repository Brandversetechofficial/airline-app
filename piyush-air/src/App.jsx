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
      { name: "Bali (DPS)", lat: -8.4095, lon: 115.1889 }
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

  const handleCommandeer = (e) => {
    e.preventDefault();
    if (!destination) {
      alert("Please specify a destination for Mr. Sharma's Jet.");
      return;
    }

    // Construct Google Flights Deep Link
    // Format: https://www.google.com/travel/flights?q=Flights+to+London+from+Toronto+on+2024-12-25
    const query = `Flights to ${destination} from ${origin} on ${travelDate}`;
    const url = `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`;

    // Open in new tab
    window.open(url, '_blank');
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
          <li><a href="#book" className="nav-cta">Commandeer Jet</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div className="hero-badge">Verified Legend • Canada's Pride 🇨🇦</div>
          <h1>The World Awaits,<br />Mr. Piyush Sharma.</h1>
          <p>From the bustling streets of Bangkok to the cafes of Paris. The East and West are calling. Mrs. Sharma and the kids are ready for the ultimate tour.</p>
          <a href="#book" className="cta-button">Global Takeoff, Dad!</a>
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
          <div className="destination-card">
            <img src="https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80" alt="Bangkok" />
            <div className="card-content">
              <h3>Bangkok: The Tuk-Tuk Tale</h3>
              <p style={{ fontSize: '1rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                "The time you negotiated a Tuk-Tuk race for the whole family! Mrs. Sharma held the bags, the kids cheered, and you navigated traffic like a local King."
              </p>
            </div>
          </div>
          <div className="destination-card">
            <img src="https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?auto=format&fit=crop&w=800&q=80" alt="Paris" />
            <div className="card-content">
              <h3>Paris: The Cafe Chronicle</h3>
              <p style={{ fontSize: '1rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                "Remember when Mrs. Sharma found that perfect crepe spot near the Eiffel Tower? You navigated the metro like a local while the kids chased pigeons. Classic."
              </p>
            </div>
          </div>
          <div className="destination-card">
            <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80" alt="Tokyo" />
            <div className="card-content">
              <h3>Tokyo: The Sushi Saga</h3>
              <p style={{ fontSize: '1rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                "Legend has it you're still the Chopstick Champion of Shibuya. The kids were amazed by the lights, but you were busy negotiating the best deals in Akihabara."
              </p>
            </div>
          </div>
          <div className="destination-card">
            <img src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80" alt="New York" />
            <div className="card-content">
              <h3>New York: Taming the Apple</h3>
              <p style={{ fontSize: '1rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                "Walking Central Park with the family in tow. You showed the kids where the real business happens on Wall Street, while Mrs. Sharma conquered 5th Avenue."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="book" className="booking-section">
        <div className="booking-container">
          <h2>Chart Your Next Course, Mr. Sharma</h2>
          <form className="booking-form" onSubmit={handleCommandeer}>
            <div className="form-group">
              <label htmlFor="from">Departing From</label>
              <input
                type="text"
                id="from"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="City or Airport"
              />
            </div>
            <div className="form-group">
              <label htmlFor="to">Flying To</label>
              <input
                type="text"
                id="to"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Anywhere in the World"
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
            <button type="submit" className="submit-btn">
              Find Real Flights ✈️
            </button>
          </form>
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
