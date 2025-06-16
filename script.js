// Моковые данные
const trips = [
  {
    id: 1, route: 'Караганда → Астана', date: '2025-06-17', time: '08:00', price: 5000,
    seats: 4, availableSeats: 2, car: 'sedan', status: 'pending',
    driver: { name: 'Айдос', phone: '+77012345678' }
  },
  {
    id: 2, route: 'Астана → Караганда', date: '2025-06-17', time: '10:30', price: 5000,
    seats: 4, availableSeats: 3, car: 'sedan', status: 'in_progress',
    driver: { name: 'Нурлан', phone: '+77087654321' }
  }
];

let selectedSeats = [];

const routeSelect = document.getElementById('route-select');
const dateSelect = document.getElementById('date-select');
const seatMap = document.getElementById('seat-map');
const bookBtn = document.getElementById('book-btn');
const driverList = document.getElementById('driver-list');

// Рендер доступных водителей
function renderDrivers() {
  driverList.innerHTML = '';
  const currentDate = new Date().toISOString().split('T')[0];
  const filteredTrips = trips.filter(trip => trip.date >= currentDate);

  filteredTrips.forEach(trip => {
    const driverCard = document.createElement('div');
    driverCard.className = 'driver-card';
    driverCard.innerHTML = `
      <p><strong>Водитель:</strong> ${trip.driver.name}</p>
      <p><strong>Маршрут:</strong> ${trip.route}</p>
      <p><strong>Дата:</strong> ${trip.date}</p>
      <p><strong>Время:</strong> ${trip.time}</p>
      <p><strong>Свободных мест:</strong> ${trip.availableSeats}</p>
      <p><strong>Статус:</strong> <span class="status ${trip.status}">${trip.status}</span></p>
    `;
    driverList.appendChild(driverCard);
  });
}

// Обработка выбора мест
seatMap.addEventListener('click', (e) => {
  if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
    e.target.classList.toggle('selected');
    const seatNumber = parseInt(e.target.dataset.seat);
    if (e.target.classList.contains('selected')) {
      selectedSeats.push(seatNumber);
    } else {
      selectedSeats = selectedSeats.filter(seat => seat !== seatNumber);
    }
  }
});

// Логика бронирования
bookBtn.addEventListener('click', () => {
  const route = routeSelect.value;
  const date = dateSelect.value;
  if (!route || !date || selectedSeats.length === 0) {
    alert('Пожалуйста, выберите маршрут, дату и места.');
    return;
  }
  const trip = trips.find(t => t.route === route && t.date === date);
  if (trip && trip.availableSeats >= selectedSeats.length) {
    trip.availableSeats -= selectedSeats.length;
    alert(`Бронь на места ${selectedSeats.join(', ')} подтверждена!`);
    selectedSeats = [];
    renderSeatMap(trip);
    renderDrivers();
  } else {
    alert('Недостаточно свободных мест или маршрут не найден.');
  }
});

// Рендер карты мест
function renderSeatMap(trip) {
  seatMap.innerHTML = '';
  const layout = carTypes[trip.car].layout;
  layout.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';
    row.forEach(seat => {
      const button = document.createElement('button');
      button.className = 'seat';
      button.dataset.seat = seat;
      if (seat === 'D') {
        button.classList.add('occupied');
        button.textContent = 'D';
      } else if (trip.passengers.some(p => p.seat === seat)) {
        button.classList.add('occupied');
        button.textContent = seat;
      } else {
        button.textContent = seat;
      }
      rowDiv.appendChild(button);
    });
    seatMap.appendChild(rowDiv);
  });
  const carIcon = document.createElement('div');
  carIcon.className = 'car-icon';
  carIcon.innerHTML = '<i class="fas fa-car-side"></i>';
  seatMap.appendChild(carIcon);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  renderDrivers();
  const initialTrip = trips[0];
  if (initialTrip) {
    renderSeatMap(initialTrip);
  }
  routeSelect.addEventListener('change', () => {
    const selectedTrip = trips.find(t => t.route === routeSelect.value);
    if (selectedTrip) {
      dateSelect.value = selectedTrip.date;
      renderSeatMap(selectedTrip);
    }
  });
  dateSelect.addEventListener('change', () => {
    const selectedTrip = trips.find(t => t.route === routeSelect.value && t.date === dateSelect.value);
    if (selectedTrip) {
      renderSeatMap(selectedTrip);
    }
  });
});
