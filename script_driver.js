// Данные поездок и бронирований
let trips = [];
let currentTrip = null;

// Моделируем "авторизацию" — вместо кода из WhatsApp просто пускаем всех
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('tripForm').style.display = 'block';
});

// Карта количества мест для каждого типа авто
const seatMaps = {
  sedan: ['П1 (переднее)', 'З1 (лево)', 'З2 (центр)', 'З3 (право)'],
  crossover: ['П1 (переднее)', 'З1 (лево)', 'З2 (центр)', 'З3 (право)'],
  minivan6: ['П1', 'З1', 'З2', 'З3', '3Р1', '3Р2'],
  minivan7: ['П1', 'З1', 'З2', 'З3', '3Р1', '3Р2', '3Р3']
};

// Клик по кнопке "Создать поездку"
document.getElementById('startTrip').addEventListener('click', function () {
  const type = document.getElementById('carType').value;
  const date = document.getElementById('tripDate').value;
  const time = document.getElementById('tripTime').value;
  const seats = seatMaps[type];

  if (!date || !time) {
    alert("Выберите дату и время");
    return;
  }

  currentTrip = {
    id: Date.now(),
    carType: type,
    seats: seats.map((name, i) => ({
      id: i + 1,
      name: name,
      booked: false,
      passenger: null
    })),
    status: 'создано',
    date,
    time
  };

  trips.push(currentTrip);
  renderTripInterface();
});

function renderTripInterface() {
  const container = document.querySelector('.container');
  container.innerHTML = `
    <h2>Поездка на ${currentTrip.date} в ${currentTrip.time}</h2>
    <p>Машина: ${currentTrip.carType.toUpperCase()}</p>
    <div id="seats" style="margin: 1rem 0;"></div>

    <button id="startBtn">Старт</button>
    <button id="inProgressBtn" disabled>В пути</button>
    <button id="completeBtn" disabled>Завершено</button>
    <button id="salonBtn">Аренда всего салона</button>
  `;

  renderSeats();

  document.getElementById('startBtn').addEventListener('click', () => {
    currentTrip.status = 'старт';
    document.getElementById('inProgressBtn').disabled = false;
    document.getElementById('startBtn').disabled = true;
  });

  document.getElementById('inProgressBtn').addEventListener('click', () => {
    currentTrip.status = 'в пути';
    document.getElementById('completeBtn').disabled = false;
    document.getElementById('inProgressBtn').disabled = true;
  });

  document.getElementById('completeBtn').addEventListener('click', () => {
    currentTrip.status = 'завершено';
    document.getElementById('completeBtn').disabled = true;
  });

  document.getElementById('salonBtn').addEventListener('click', () => {
    currentTrip.seats.forEach(seat => {
      seat.booked = true;
      seat.passenger = 'Аренда всего салона';
    });
    renderSeats();
  });
}

function renderSeats() {
  const seatDiv = document.getElementById('seats');
  seatDiv.innerHTML = currentTrip.seats.map(seat => `
    <div style="padding: 0.5rem; margin: 0.25rem; background: ${seat.booked ? '#ccc' : '#e9f0fb'}; border-radius: 6px;">
      ${seat.name} — ${seat.booked ? 'Занято' : 'Свободно'}
      ${seat.passenger ? `<br><small>Пассажир: ${seat.passenger}</small>` : ''}
    </div>
  `).join('');
}
