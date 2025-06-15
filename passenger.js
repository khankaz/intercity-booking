const carSeating = document.getElementById("carSeating");
const status = document.getElementById("status");

const totalSeats = 6;
let selectedSeat = null;

// Допустим, места 2 и 4 уже забронированы
const bookedSeats = [2, 4];

function renderSeats() {
  carSeating.innerHTML = "";

  for (let i = 1; i <= totalSeats; i++) {
    const seat = document.createElement("div");
    seat.className = "seat";
    seat.textContent = i;

    if (bookedSeats.includes(i)) {
      seat.classList.add("booked");
    } else {
      seat.addEventListener("click", () => {
        document.querySelectorAll(".seat").forEach(s => s.classList.remove("selected"));
        seat.classList.add("selected");
        selectedSeat = i;
      });
    }

    carSeating.appendChild(seat);
  }

  // Добавляем водителя (визуально)
  const driver = document.createElement("div");
  driver.className = "seat";
  driver.textContent = "🚗";
  driver.style.backgroundColor = "#333";
  driver.style.color = "#fff";
  driver.style.gridColumn = "span 3";
  driver.style.cursor = "default";
  carSeating.insertBefore(driver, carSeating.firstChild);
}

renderSeats();

document.getElementById("confirmBooking").addEventListener("click", () => {
  if (!selectedSeat) {
    status.textContent = "Пожалуйста, выберите место.";
    return;
  }
  status.textContent = `Вы забронировали место №${selectedSeat}`;
});
const drivers = [
  {
    name: "Иван",
    date: "2025-06-17",
    time: "08:00",
    route: "Караганда → Астана",
    bookedSeats: [1, 4],
    totalSeats: 6
  },
  {
    name: "Алихан",
    date: "2025-06-17",
    time: "10:30",
    route: "Астана → Караганда",
    bookedSeats: [2],
    totalSeats: 6
  }
];

function renderDrivers() {
  const driversContainer = document.getElementById("drivers");
  drivers.forEach(driver => {
    const card = document.createElement("div");
    const free = driver.totalSeats - driver.bookedSeats.length;
    card.innerHTML = `
      <strong>${driver.name}</strong><br>
      Маршрут: ${driver.route}<br>
      Время: ${driver.date} ${driver.time}<br>
      Свободных мест: ${free}/${driver.totalSeats}<br>
      <div style="margin-top: 5px;">
        ${[...Array(driver.totalSeats).keys()].map(i =>
          `<span style="
            display:inline-block;
            width:20px;
            height:20px;
            margin:2px;
            background:${driver.bookedSeats.includes(i+1) ? '#999' : '#4CAF50'};
            border-radius:4px;"></span>`
        ).join('')}
      </div>
      <hr>
    `;
    driversContainer.appendChild(card);
  });
}

renderDrivers();

