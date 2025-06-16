// Моковые данные
const trips = [
  {
    id: 1,
    route: 'Караганда → Астана',
    date: '2025-06-17',
    time: '08:00',
    price: 5000,
    seats: 4,
    availableSeats: 2,
    car: 'sedan',
    carModel: 'Toyota Camry, Седан',
    status: 'pending',
    driver: { name: 'Айдос', phone: '+77012345678' },
    passengers: [{ phone: '+77098765432', seat: 1, address: 'ул. Ленина, 10' }],
    photo: 'https://via.placeholder.com/300x200?text=Car+of+Aidos',
    rating: 4.5,
    reviews: [{ user: 'Петр', comment: 'Отличный водитель!', rating: 5, approved: true }],
    passengerRoutes: ['ул. Ленина, 10 → центр Астаны', 'ул. Мира, 5 → юг Астаны']
  },
  {
    id: 2,
    route: 'Астана → Караганда',
    date: '2025-06-17',
    time: '10:30',
    price: 6000,
    seats: 6,
    availableSeats: 3,
    car: 'minivan6',
    carModel: 'Hyundai Starex, Минивэн (6 мест)',
    status: 'in_progress',
    driver: { name: 'Нурлан', phone: '+77087654321' },
    passengers: [],
    photo: 'https://via.placeholder.com/300x200?text=Car+of+Nurlan',
    rating: 4.0,
    reviews: [{ user: 'Мария', comment: 'Хорошо, но опоздал', rating: 4, approved: true }],
    passengerRoutes: []
  }
];

let selectedSeats = [];

const cityGrid = document.getElementById('city-grid');
const tripsGrid = document.getElementById('trips-grid');
const modal = document.getElementById('trip-modal');
const closeBtn = document.getElementById('trip-modal').querySelector('.close-btn');
const modalTitle = document.getElementById('modal-title');
const modalCarPhoto = document.getElementById('modal-car-photo');
const modalDriverName = document.getElementById('modal-driver-name');
const modalTripDate = document.getElementById('modal-trip-date');
const modalCarModel = document.getElementById('modal-car-model');
const modalRating = document.getElementById('modal-rating');
const modalReviews = document.getElementById('modal-reviews');
const modalSeatMap = document.getElementById('modal-seat-map');
const modalPassengerRoutes = document.getElementById('modal-passenger-routes');
const bookModalBtn = document.getElementById('book-modal-btn');
const routeFilter = document.getElementById('route-filter');
const dateFilter = document.getElementById('date-filter');
const timeFilter = document.getElementById('time-filter');
const carTypeFilter = document.getElementById('car-type-filter');

// Рендер плиток городов
function renderCities() {
  cityGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('city-card')) {
      const city = e.target.dataset.city;
      window.location.href = `trip-page.html?city=${city}`;
    }
  });
}

// Рендер поездок
function renderTrips() {
  tripsGrid.innerHTML = '';
  const urlParams = new URLSearchParams(window.location.search);
  const city = urlParams.get('city');
  const filteredTrips = trips.filter(trip => {
    const routeMatch = !routeFilter.value || trip.route.includes(routeFilter.value);
    const dateMatch = !dateFilter.value || trip.date === dateFilter.value;
    const timeMatch = !timeFilter.value || trip.time.includes(timeFilter.value);
    const carMatch = !carTypeFilter.value || trip.car === carTypeFilter.value;
    const cityMatch = !city || trip.route.includes(city);
    return routeMatch && dateMatch && timeMatch && carMatch && cityMatch;
  });

  filteredTrips.forEach(trip => {
    const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const [year, month, day] = trip.date.split('-');
    const dateText = `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
    const tripCard = document.createElement('div');
    tripCard.className = 'trip-card';
    tripCard.innerHTML = `
      <p><strong>Маршрут:</strong> ${trip.route}</p>
      <p><strong>Дата:</strong> ${dateText}</p>
      <p><strong>Время:</strong> ${trip.time}</p>
      <p><strong>Цена:</strong> ${trip.price} KZT</p>
      <p><strong>Свободных мест:</strong> ${trip.availableSeats}</p>
      <p><strong>Кузов:</strong> ${trip.carModel.split(', ')[1]}</p>
      <p><strong>Водитель:</strong> ${trip.driver.name}</p>
      <p><strong>Статус:</strong> <span class="status ${trip.status}">${trip.status}</span></p>
      <button class="details-btn">Подробнее</button>
    `;
    tripCard.addEventListener('click', () => openModal(trip));
    tripsGrid.appendChild(tripCard);
  });
}

// Открытие модального окна
function openModal(trip) {
  modal.style.display = 'flex';
  modalTitle.textContent = `Поездка: ${trip.route}`;
  modalCarPhoto.src = trip.photo;
  modalDriverName.textContent = trip.driver.name;
  const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const [year, month, day] = trip.date.split('-');
  modalTripDate.textContent = `${day} ${monthNames[parseInt(month) - 1]} ${year} в ${trip.time}`;
  modalCarModel.textContent = trip.carModel;
  modalRating.textContent = trip.rating;
  modalReviews.innerHTML = trip.reviews.filter(r => r.approved).map(r => `<p><strong>${r.user}:</strong> ${r.rating} ★ - ${r.comment}</p>`).join('');
  renderSeatMap(trip);
  modalPassengerRoutes.innerHTML = trip.passengerRoutes.map(route => `<p>${route}</p>`).join('');
  selectedSeats = [];
  modalSeatMap.dataset.tripId = trip.id;
}

// Рендер карты мест
function renderSeatMap(trip) {
  modalSeatMap.innerHTML = '';
  const layout = carTypes[trip.car].layout;
  layout.forEach(seat => {
    const button = document.createElement('i');
    button.className = 'fas fa-chair seat';
    button.dataset.seat = seat;
    if (seat === 'D' || trip.passengers.some(p => p.seat === seat)) {
      button.classList.add('occupied');
    } else {
      button.addEventListener('click', () => selectSeat(trip.id, seat));
    }
    modalSeatMap.appendChild(button);
  });
}

// Выбор места
function selectSeat(tripId, seat) {
  const seatElement = modalSeatMap.querySelector(`[data-seat="${seat}"]`);
  if (!seatElement.classList.contains('occupied')) {
    seatElement.classList.toggle('selected');
    if (seatElement.classList.contains('selected')) {
      selectedSeats.push(seat);
    } else {
      selectedSeats = selectedSeats.filter(s => s !== seat);
    }
  }
}

// Бронирование
bookModalBtn.addEventListener('click', () => {
  const tripId = modalSeatMap.dataset.tripId;
  const trip = trips.find(t => t.id === parseInt(tripId));
  if (trip && trip.availableSeats >= selectedSeats.length) {
    trip.availableSeats -= selectedSeats.length;
    trip.passengers.push(...selectedSeats.map(seat => ({ phone: '+7700000000', seat, address: 'адрес' })));
    alert(`Бронь на места ${selectedSeats.join(', ')} подтверждена!`);
    selectedSeats = [];
    closeModal();
    renderTrips();
  } else {
    alert('Недостаточно свободных мест.');
  }
});

// Закрытие модального окна
closeBtn.addEventListener('click', closeModal);
function closeModal() {
  modal.style.display = 'none';
  selectedSeats = [];
}

// Фильтрация поездок
[routeFilter, dateFilter, timeFilter, carTypeFilter].forEach(filter => {
  filter.addEventListener('change', renderTrips);
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('trip-page.html')) {
    renderTrips();
  } else {
    renderCities();
  }
});

// Константы для типов авто
const carTypes = {
  sedan: { name: 'Седан', seats: 4, layout: [1, 2, 3, 4] },
  minivan6: { name: 'Минивэн (6 мест)', seats: 6, layout: [1, 2, 3, 4, 5, 6] }
};
