// Примерные поездки (в реальности должны загружаться с сервера)
const sampleTrips = [
  {
    id: 1001,
    carType: 'sedan',
    route: 'Караганда → Астана',
    date: '2025-06-20',
    time: '08:00',
    status: 'создано',
    seats: [
      { id: 1, name: 'П1 (переднее)', booked: false, passenger: null },
      { id: 2, name: 'З1 (лево)', booked: false, passenger: null },
      { id: 3, name: 'З2 (центр)', booked: false, passenger: null },
      { id: 4, name: 'З3 (право)', booked: false, passenger: null }
    ]
  },
  {
    id: 1002,
    carType: 'minivan7',
    route: 'Астана → Боровое',
    date: '2025-06-20',
    time: '10:30',
    status: 'старт',
    seats: [
      { id: 1, name: 'П1', booked: true, passenger: 'Айгүл' },
      { id: 2, name: 'З1', booked: false, passenger: null },
      { id: 3, name: 'З2', booked: false, passenger: null },
      { id: 4, name: 'З3', booked: false, passenger: null },
      { id: 5, name: '3Р1', booked: true, passenger: 'Али' },
      { id: 6, name: '3Р2', booked: false, passenger: null },
      { id: 7, name: '3Р3', booked: false, passenger: null }
    ]
  }
];

// Отображение всех поездок
function renderAvailableTrips() {
  const tripContainer = document.getElementById('tripList');
  tripContainer.innerHTML = '';

  sampleTrips.forEach(trip => {
    const div = document.createElement('div');
    div.className = 'trip-card';
    div.innerHTML = `
      <h3>${trip.route}</h3>
      <p><strong>${trip.date}</strong> в <strong>${trip.time}</strong></p>
      <p>Тип авто: ${trip.carType.toUpperCase()}</p>
      <p>Статус: <strong>${trip.status}</strong></p>
      <div class="seats">
        ${trip.seats.map(seat => `
          <button class="seat-btn" data-trip="${trip.id}" data-seat="${seat.id}" ${seat.booked ? 'disabled' : ''}>
            ${seat.name}
          </button>
        `).join('')}
      </div>
      <button class="salon-btn" data-trip="${trip.id}">Арендовать весь салон</button>
      <hr>
    `;
    tripContainer.appendChild(div);
  });

  setupSeatBookingHandlers();
  setupSalonBookingHandlers();
}

function setupSeatBookingHandlers() {
  document.querySelectorAll('.seat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tripId = parseInt(btn.dataset.trip);
      const seatId = parseInt(btn.dataset.seat);
      const trip = sampleTrips.find(t => t.id === tripId);
      const seat = trip.seats.find(s => s.id === seatId);

      const name = prompt(`Введите ваше имя для бронирования места "${seat.name}"`);
      if (!name) return;

      seat.booked = true;
      seat.passenger = name;
      alert(`Место ${seat.name} успешно забронировано!`);
      renderAvailableTrips();
    });
  });
}

function setupSalonBookingHandlers() {
  document.querySelectorAll('.salon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tripId = parseInt(btn.dataset.trip);
      const trip = sampleTrips.find(t => t.id === tripId);

      const name = prompt(`Введите ваше имя для аренды всего салона`);
      if (!name) return;

      trip.seats.forEach(seat => {
        seat.booked = true;
        seat.passenger = name + ' (аренда салона)';
      });

      alert(`Вы арендовали весь салон!`);
      renderAvailableTrips();
    });
  });
}

renderAvailableTrips();
