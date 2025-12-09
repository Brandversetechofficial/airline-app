document.addEventListener('DOMContentLoaded', () => {
    // 1. Live Clock
    function updateClock() {
        const now = new Date();
        document.getElementById('live-clock').innerText = now.toLocaleTimeString('en-US', { hour12: false }) + " UTC";
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 2. Mock Flight Data Generation
    const cities = [
        { name: "Paris (CDG)", weather: "Sunny 22°C" },
        { name: "Tokyo (HND)", weather: "Clear 18°C" },
        { name: "New York (JFK)", weather: "Windy 15°C" },
        { name: "London (LHR)", weather: "Rain 12°C" },
        { name: "Dubai (DXB)", weather: "Hot 35°C" },
        { name: "Sydney (SYD)", weather: "Nice 25°C" }
    ];

    const flights = [];
    for (let i = 0; i < 6; i++) {
        const city = cities[Math.floor(Math.random() * cities.length)];
        flights.push({
            flight: `PYSH-${100 + i}`,
            origin: "Toronto (YYZ)",
            dest: city.name,
            time: "ON TIME",
            status: "WAITING FOR VIP",
            weather: city.weather
        });
    }

    const tbody = document.getElementById('flight-board-body');
    if (tbody) {
        flights.forEach(f => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${f.flight}</td>
                <td>${f.origin}</td>
                <td>${f.dest}</td>
                <td style="color: #0f0;">${f.time}</td>
                <td class="flight-status-on-time">${f.status}</td>
                <td>${f.weather}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // 3. Counting Animation for Stats
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Add infinite symbol or text after done
                if (end > 1000000) obj.innerHTML = "1,000,000+";
            }
        };
        window.requestAnimationFrame(step);
    }

    const milesObj = document.getElementById("miles-counter");
    const countryObj = document.getElementById("countries-counter");

    // Animate when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(milesObj, 0, 1500000, 2000);
                animateValue(countryObj, 0, 195, 2000);
                observer.unobserve(entry.target);
            }
        });
    });

    if (milesObj) observer.observe(document.querySelector('.stats-section'));

    // 4. Smooth Scroll & Form
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    const form = document.querySelector('.booking-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Jet Commandeered! The crew is preparing for your arrival, Mr. Sharma.");
        });
    }
});
