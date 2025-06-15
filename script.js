const routes = [
  { name: "Караганда → Астана", seats: 4, bookedSeats: [], status: "Ожидание", vehicle: "sedan" },
  { name: "Астана → Боровое", seats: 6, bookedSeats: [], status: "Ожидание", vehicle: "crossover" },
  { name: "Боровое → Караганда", seats: 7, bookedSeats: [], status: "Ожидание", vehicle: "minivan" }
];

// Определение компоновки сидений по типу машины
const vehicleLayout = {
  sedan: ["1", "2", "3", "4"],
  crossover: ["1", "2", "3", "4", "5", "6"],
  minivan: ["1", "2", "3", "4", "5", "6", "7"]
};

function showPassenger() {
  document.getElementById("passengerSection").classList.remove("hidden");
  document.getElementById("driverSection").classList.add("hidden");
  renderRoutes();
  renderSeatOptions();
}

function showDriver() {
  document.getElementById("driverSection").classList.remove("hidden");
  document.getElementById("passengerSection").classList.add("hidden");
  renderDriverRoutes();
  updateSeatView(0);
}

function renderRoutes() {
  const select = document.getElementById("routeSelect");
  const container = document.getElementById("routes");
  select.innerHTML = "";
  container.innerHTML = "";

  routes.forEach((route, i) => {
    const freeSeats = route.seats - route.bookedSeats.length;
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${route.name} — свободно: ${freeSeats}`;
    select.appendChild(option);

    const card = document.createElement("div");
    card.className = "route-card";
    card.innerHTML = `<strong>${route.name}</strong><br>Свободных мест: ${freeSeats}<br>Статус: ${route.status}`;
    container.appendChild(card);
  });
}

function renderDriverRoutes() {
  const select = document.getElementById("driverRouteSelect");
  select.innerHTML = "";
  routes.forEach((r, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${r.name}`;
    select.appendChild(opt);
  });
}

function renderSeatOptions() {
  const routeIndex = document.getElementById("routeSelect").value || 0;
  const route = routes[routeIndex];
  const layout = vehicleLayout[route.vehicle];
  const seatSelect = document.getElementById("seatSelect");
  seatSelect.innerHTML = "";

  layout.forEach(seat => {
    const isBooked = route.bookedSeats.includes(seat);
    if (!isBooked) {
      const opt = document.createElement("option");
      opt.value = seat;
      opt.textContent = `Место ${seat}`;
      seatSelect.appendChild(opt);
    }
  });
}

document.getElementById("routeSelect").addEventListener("change", renderSeatOptions);

document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const routeIndex = +document.getElementById("routeSelect").value;
  const seat = document.getElementById("seatSelect").value;
  const route = routes[routeIndex];

  if (!route.bookedSeats.includes(seat)) {
    route.bookedSeats.push(seat);
    document.getElementById("status").textContent = `Место ${seat} успешно забронировано!`;
    renderRoutes();
    renderSeatOptions();
    updateSeatView(routeIndex);
  } else {
    document.getElementById("status").textContent = "Место уже занято!";
  }
  e.target.reset();
});

document.getElementById("salonButton").addEventListener("click", () => {
  const routeIndex = +document.getElementById("routeSelect").value;
  const route = routes[routeIndex];
  const layout = vehicleLayout[route.vehicle];
  route.bookedSeats = [...layout];
  renderRoutes();
  renderSeatOptions();
  updateSeatView(routeIndex);
  document.getElementById("status").textContent = "Весь салон забронирован!";
});

function startTrip() {
  const i = +document.getElementById("driverRouteSelect").value;
  routes[i].status = "Ожидание";
  document.getElementById("tripStatus").textContent = "Ожидание";
  updateSeatView(i);
}

function setInTransit() {
  const i = +document.getElementById("driverRouteSelect").value;
  routes[i].status = "В пути";
  document.getElementById("tripStatus").textContent = "В пути";
  updateSeatView(i);
}

function endTrip() {
  const i = +document.getElementById("driverRouteSelect").value;
  routes[i].status = "Завершено";
  document.getElementById("tripStatus").textContent = "Завершено";
  updateSeatView(i);
}

function updateSeatView(routeIndex) {
  const view = document.getElementById("seatsVisual");
  view.innerHTML = "";
  const route = routes[routeIndex];
  const layout = vehicleLayout[route.vehicle];

  layo
