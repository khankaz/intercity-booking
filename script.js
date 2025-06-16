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
