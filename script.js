const routes = [
  "Караганда – Астана",
  "Караганда – Щучинск",
  "Караганда – Бурабай",
  "Астана – Караганда",
  "Щучинск – Караганда",
  "Бурабай – Караганда"
];

const seatsPerRoute = {};
routes.forEach(route => {
  seatsPerRoute[route] = {
    seats: Array(6).fill(false), // false = свободно
  };
});

const routeSelect = document.getElementById("routeSelect");
routes.forEach(route => {
  const opt = document.createElement("option");
  opt.value = route;
  opt.textContent = route;
  routeSelect.appendChild(opt);
});

function renderSeatMap(routeName) {
  const container = document.getElementById("seatMap");
  container.innerHTML = "";
  const state = seatsPerRoute[routeName];

  for (let i = 0; i < state.seats.length; i++) {
    const seat = document.createElement("button");
    seat.className = "seat";
    seat.textContent = `Место ${i + 1}`;
    seat.disabled = state.seats[i];
    seat.dataset.index = i;
    seat.onclick = () => {
      document.querySelectorAll(".seat").forEach(btn => btn.classList.remove("selected"));
      seat.classList.add("selected");
    };
    container.appendChild(seat);
  }
}

routeSelect.addEventListener("change", () => {
  renderSeatMap(routeSelect.value);
});

document.getElementById("salonButton").addEventListener("click", () => {
  const route = routeSelect.value;
  seatsPerRoute[route].seats = Array(6).fill(true);
  renderSeatMap(route);
  document.getElementById("status").textContent = "Весь салон забронирован!";
});

document.getElementById("bookingForm").addEventListener("submit", e => {
  e.preventDefault();
  const route = routeSelect.value;
  const selected = document.querySelector(".seat.selected");
  if (!selected) {
    document.getElementById("status").textContent = "Выберите место!";
    return;
  }

  const index = selected.dataset.index;
  seatsPerRoute[route].seats[index] = true;
  renderSeatMap(route);
  document.getElementById("status").textContent = `Место ${+index + 1} успешно забронировано!`;
});
const driverRoute = document.getElementById("driverRoute");
if (driverRoute) {
  routes.forEach(route => {
    const opt = document.createElement("option");
    opt.value = route;
    opt.textContent = route;
    driverRoute.appendChild(opt);
  });

  document.getElementById("driverForm").addEventListener("submit", e => {
    e.preventDefault();
    const route = driverRoute.value;
    const date = document.getElementById("driverDate").value;
    const seats = +document.getElementById("seats").value;
    const name = e.target.driverName.value;
    const phone = e.target.driverPhone.value;

    // Здесь сохраняем данные поездки
    localStorage.setItem("driverTrip", JSON.stringify({
      route, date, seats, name, phone
    }));

    document.getElementById("driverStatus").textContent =
      `Поездка по маршруту "${route}" на ${date} добавлена с ${seats} местами.`;
  });
}}
// Карта мест в салоне (седан 5 мест)
const seatMapContainer = document.getElementById("seatMap");
const seatCount = 5; // 1 водитель + 4 пассажира (место водителя не отображаем)

function renderSeatMap(bookedSeats = []) {
  seatMapContainer.innerHTML = "<strong>Выберите место:</strong><br>";
  for (let i = 1; i <= 4; i++) {
    const btn = document.createElement("button");
    btn.textContent = `Место ${i}`;
    btn.className = bookedSeats.includes(i) ? "seat booked" : "seat available";
    btn.disabled = bookedSeats.includes(i);
    btn.onclick = () => {
      document.getElementById("selectedSeat")?.remove();
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "seat";
      input.value = i;
      input.id = "selectedSeat";
      seatMapContainer.appendChild(input);
    };
    seatMapContainer.appendChild(btn);
  }
}

// Показываем активные поездки от водителей
function renderActiveTrips() {
  const tripData = localStorage.getItem("driverTrip");
  const container = document.getElementById("activeTrips");
  if (!tripData || !container) return;

  const trip = JSON.parse(tripData);
  const div = document.createElement("div");
  div.className = "route-card";
  div.innerHTML = `
    <strong>Маршрут:</strong> ${trip.route}<br>
    <strong>Дата:</strong> ${trip.date}<br>
    <strong>Свободных мест:</strong> ${trip.seats}<br>
    <strong>Водитель:</strong> ${trip.name}<br>
    <strong>Телефон:</strong> ${trip.phone}<br>
    <div class="seat-visual">
      <span>Места:</span> ${"🪑".repeat(trip.seats)} ${"❌".repeat(6 - trip.seats)}
    </div>
  `;
  container.appendChild(div);

  renderSeatMap([]); // пока без брони
}}

renderActiveTrips();
if (window.location.pathname.endsWith('city.html')) {
  const params = new URLSearchParams(window.location.search);
  const dest = params.get('to');
  document.getElementById('pageTitle').textContent = `Поездки в ${dest}`;

  // Пример статичных предложений
  const offers = [
    { id:1, name:'Иван', route:`Караганда → ${dest}`, date:'2025-06-20', time:'09:00', price:4000, seats:3, carType:'sedan' },
    { id:2, name:'Мария', route:`Караганда → ${dest}`, date:'2025-06-20', time:'11:30', price:4500, seats:2, carType:'crossover' }
  ];

  function renderOffers(list) {
    const cont = document.getElementById('cards');
    cont.innerHTML = '';
    list.forEach(o => {
      const div = document.createElement('div');
      div.className = 'offer-card';
      div.innerHTML = `
        <h3>${o.route}</h3>
        <p>${o.date} &nbsp; ${o.time}</p>
        <p>Кузов: ${o.carType} &nbsp; Цена: ${o.price} ₸</p>
        <p>Свободных мест: ${o.seats}</p>
        <p>Водитель: ${o.name}</p>
        <button onclick="location.href='trip.html?id=${o.id}'">Подробнее →</button>`;
      cont.appendChild(div);
    });
  }

  renderOffers(offers);
}}
