const routes = [
  { name: "Караганда → Астана", seats: 4, booked: 1 },
  { name: "Астана → Боровое", seats: 4, booked: 2 },
  { name: "Боровое → Караганда", seats: 4, booked: 3 }
];

function updateRouteDisplay() {
  const list = document.getElementById("routesList");
  const select = document.getElementById("routeSelect");
  list.innerHTML = "";
  select.innerHTML = "";

  routes.forEach((route, index) => {
    const available = route.seats - route.booked;
    const card = document.createElement("div");
    card.className = "route-card";
    card.innerHTML = `<strong>${route.name}</strong><br>Свободных мест: ${available}`;
    list.appendChild(card);

    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${route.name} — ${available} мест`;
    select.appendChild(option);
  });
}

document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const index = document.getElementById("routeSelect").value;
  const route = routes[index];
  const message = document.getElementById("resultMessage");

  if (route.booked < route.seats) {
    route.booked++;
    updateRouteDisplay();
    message.style.color = "green";
    message.textContent = "✅ Бронирование успешно!";
  } else {
    message.style.color = "red";
    message.textContent = "❌ Мест больше нет!";
  }

  this.reset();
});

updateRouteDisplay();
