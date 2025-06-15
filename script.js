const routes = [
  { name: "Караганда → Астана", seats: 4, booked: 0 },
  { name: "Астана → Боровое", seats: 4, booked: 0 },
  { name: "Боровое → Караганда", seats: 4, booked: 0 }
];

function renderRoutes() {
  const routeContainer = document.getElementById("routes");
  const select = document.getElementById("routeSelect");
  routeContainer.innerHTML = "";
  select.innerHTML = "";

  routes.forEach((route, i) => {
    const freeSeats = route.seats - route.booked;
    const card = document.createElement("div");
    card.className = "route-card";
    card.innerHTML = `<strong>${route.name}</strong><br>Свободных мест: ${freeSeats}`;
    routeContainer.appendChild(card);

    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${route.name} (осталось мест: ${freeSeats})`;
    select.appendChild(option);
  });
}

renderRoutes();

const form = document.getElementById("bookingForm");
form.addEventListener("submit", function(e) {
  e.preventDefault();
  const routeIndex = document.getElementById("routeSelect").value;
  const route = routes[routeIndex];
  if (route.booked < route.seats) {
    route.booked++;
    renderRoutes();
    document.getElementById("status").textContent = "Бронирование успешно!";
  } else {
    document.getElementById("status").textContent = "Мест больше нет.";
  }
  form.reset();
  updateSeatMap(); // обновить схему после сброса
});

document.getElementById("salonButton").addEventListener("click", function () {
  const routeIndex = document.getElementById("routeSelect").value;
  const route = routes[routeIndex];
  route.booked = route.seats;
  renderRoutes();
  document.getElementById("status").textContent = "Весь салон успешно забронирован!";
  form.reset();
  updateSeatMap();
});

const seatMap = document.getElementById("seatMap");
const carTypeSelect = document.getElementById("carTypeSelect");
carTypeSelect.addEventListener("change", updateSeatMap);

function updateSeatMap() {
  const type = carTypeSelect.value;
  let seats = [];

  switch (type) {
    case "sedan":
    case "crossover4":
      seats = ["Вод", "П", "ЗЛ", "ЗП"];
      break;
    case "crossover6":
      seats = ["Вод", "П", "2ЗЛ", "2ЗП", "3Л", "3П"];
      break;
    case "minivan6":
      seats = ["Вод", "П", "2Л", "2П", "3Л", "3П"];
      break;
    case "minivan7":
      seats = ["Вод", "П", "2Л", "2Ц", "2П", "3Л", "3П"];
      break;
  }

  seatMap.innerHTML = "";
  seats.forEach(seat => {
    const div = document.createElement("div");
    div.className = "seat";
    div.textContent = seat;
    seatMap.appendChild(div);
    div.addEventListener("click", () => {
      document.querySelectorAll(".seat").forEach(s => s.classList.remove("selected"));
      div.classList.add("selected");
    });
  });
}

updateSeatMap();
