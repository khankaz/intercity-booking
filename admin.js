const routes = [
  { name: "Караганда → Астана", seats: 4, booked: [
    { name: "Айгүл", phone: "+77012345678", address: "Абая 12", seat: 2 },
    { name: "Марат", phone: "+77022334455", address: "Космонавтов 8", seat: 3 }
  ], status: "ожидание" },
  { name: "Астана → Боровое", seats: 4, booked: [], status: "ожидание" },
  { name: "Боровое → Караганда", seats: 4, booked: [], status: "ожидание" }
];

function renderDashboard() {
  const container = document.getElementById("driverDashboard");
  container.innerHTML = "";

  routes.forEach((route, idx) => {
    const card = document.createElement("div");
    card.className = "route-card";

    let passengers = "";
    if (route.booked.length > 0) {
      passengers = route.booked.map((p, i) => `
        <li>
          <strong>${p.name}</strong> — ${p.phone}<br>
          Адрес: ${p.address}<br>
          Место №${p.seat}
        </li>
      `).join("");
    } else {
      passengers = "<li>Пока нет пассажиров</li>";
    }

    card.innerHTML = `
      <h3>${route.name}</h3>
      <p>Статус: <strong>${route.status}</strong></p>
      <ul>${passengers}</ul>
      <button onclick="changeStatus(${idx}, 'поездка началась')">Старт</button>
      <button onclick="changeStatus(${idx}, 'в пути')">В пути</button>
      <button onclick="changeStatus(${idx}, 'завершено')">Завершено</button>
    `;

    container.appendChild(card);
  });
}

function changeStatus(index, newStatus) {
  routes[index].status = newStatus;
  renderDashboard();
}

renderDashboard();
