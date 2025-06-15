const routes = [
  { name: "Караганда → Астана", seats: 6, booked: [] },
  { name: "Астана → Караганда", seats: 6, booked: [] },
  { name: "Караганда → Бурабай", seats: 6, booked: [] },
  { name: "Бурабай → Караганда", seats: 6, booked: [] },
  { name: "Караганда → Щучинск", seats: 6, booked: [] },
  { name: "Щучинск → Караганда", seats: 6, booked: [] }
];

const seatLayouts = {
  sedan: [
    { id: "1", label: "Переднее пассажирское" },
    { id: "2", label: "Заднее слева" },
    { id: "3", label: "Заднее по центру" },
    { id: "4", label: "Заднее справа" }
  ],
  crossover: [
    { id: "1", label: "Переднее пассажирское" },
    { id: "2", label: "Заднее слева" },
    { id: "3", label: "Заднее по центру" },
    { id: "4", label: "Заднее справа" }
  ],
  minivan6: [
    { id: "1", label: "Переднее пассажирское" },
    { id: "2", label: "2-й ряд слева" },
    { id: "3", label: "2-й ряд по центру" },
    { id: "4", label: "2-й ряд справа" },
    { id: "5", label: "3-й ряд слева" },
    { id: "6", label: "3-й ряд справа" }
  ],
  minivan7: [
    { id: "1", label: "Переднее пассажирское" },
    { id: "2", label: "2-й ряд слева" },
    { id: "3", label: "2-й ряд по центру" },
    { id: "4", label: "2-й ряд справа" },
    { id: "5", label: "3-й ряд слева" },
    { id: "6", label: "3-й ряд по центру" },
    { id: "7", label: "3-й ряд справа" }
  ]
};

let currentLayout = seatLayouts.sedan;

function renderRoutes() {
  const routeSelect = document.getElementById("routeSelect");
  routeSelect.innerHTML = "";
  routes.forEach((route, index) => {
    const option = document.createElement("option");
    const freeSeats = currentLayout.length - route.booked.length;
    option.value = index;
    option.textContent = `${route.name} (осталось мест: ${freeSeats})`;
    routeSelect.appendChild(option);
  });
}

function renderSeats() {
  const seatContainer = document.getElementById("seatContainer");
  seatContainer.innerHTML = "";
  const routeIndex = parseInt(document.getElementById("routeSelect").value);
  const bookedSeats = routes[routeIndex].booked;

  currentLayout.forEach(seat => {
    const seatDiv = document.createElement("div");
    seatDiv.className = "seat";
    seatDiv.textContent = seat.label;
    seatDiv.dataset.id = seat.id;

    if (bookedSeats.includes(seat.id)) {
      seatDiv.classList.add("booked");
    } else {
      seatDiv.addEventListener("click", function () {
        seatDiv.classList.toggle("selected");
      });
    }

    seatContainer.appendChild(seatDiv);
  });
}

function updateCarType() {
  const carType = document.getElementById("carType").value;
  currentLayout = seatLayouts[carType];
  renderRoutes();
  renderSeats();
}

document.getElementById("carType").addEventListener("change", updateCarType);
document.getElementById("routeSelect").addEventListener("change", renderSeats);

document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const routeIndex = parseInt(document.getElementById("routeSelect").value);
  const selectedSeats = Array.from(document.querySelectorAll(".seat.selected"))
    .map(seat => seat.dataset.id);

  if (selectedSeats.length === 0) {
    alert("Выберите хотя бы одно место.");
    return;
  }

  const route = routes[routeIndex];
  const conflict = selectedSeats.some(seat => route.booked.includes(seat));
  if (conflict) {
    alert("Одно или несколько мест уже заняты.");
    return;
  }

  route.booked.push(...selectedSeats);
  alert("Бронирование успешно!");
  this.reset();
  renderRoutes();
  renderSeats();
});

document.getElementById("salonButton").addEventListener("click", function () {
  const routeIndex = parseInt(document.getElementById("routeSelect").value);
  const allSeats = currentLayout.map(seat => seat.id);
  routes[routeIndex].booked = [...allSeats];
  alert("Весь салон успешно забронирован.");
  renderRoutes();
  renderSeats();
});

document.getElementById("selectAllSeats").addEventListener("click", function () {
  const routeIndex = parseInt(document.getElementById("routeSelect").value);
  const booked = routes[routeIndex].booked;

  document.querySelectorAll(".seat").forEach(seat => {
    if (!booked.includes(seat.dataset.id)) {
      seat.classList.add("selected");
    }
  });
});

window.addEventListener("DOMContentLoaded", () => {
  renderRoutes();
  renderSeats();
});
