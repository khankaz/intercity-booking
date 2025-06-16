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
    price: 5000,
    seats: 4,
    availableSeats: 3,
    car: 'sedan',
    carModel: 'Hyundai Solaris, Седан',
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

const driverList = document.getElementById('driver-list');
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

// Рендер плиток водителей
function renderDrivers() {
  driverList.innerHTML = '';
  const currentDate = new Date().toISOString().split('T')[0];
  const filteredTrips = trips.filter(trip => trip.date >= currentDate);

  filteredTrips.forEach(trip => {
    const driverCard = document.createElement('div');
    driverCard.className = 'driver-card';
    const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const [year, month, day] = trip.date.split('-');
    const dateText = `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
    driverCard.innerHTML = `
      <p><strong>Водитель:</strong> ${trip.driver.name}</p>
      <p><strong>Маршрут:</strong> ${trip.route}</p>
      <p><strong>Дата:</strong> ${dateText}</p>
      <p><strong>Время:</strong> ${trip.time}</p>
      <p><strong>Марка и кузов:</strong> ${trip.carModel}</p>
      <p><strong>Свободных мест:</strong> ${trip.availableSeats}</p>
      <p><strong>Статус:</strong> <span class="status ${trip.status}">${trip.status}</span></p>
      <button class="details-btn">Подробнее</button>
    `;
    driverCard.addEventListener('click', () => openModal(trip));
    driverList.appendChild(driverCard);
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
}

// Рендер карты мест
function renderSeatMap(trip) {
  modalSeatMap.innerHTML = '';
  const layout = carTypes[trip.car].layout;
  layout.forEach(row => {
    row.forEach(seat => {
      const button = document.createElement('i');
      button.className = 'fas fa-chair seat';
      button.dataset.seat = seat;
      if (seat === 'D') {
        button.classList.add('occupied');
      } else if (trip.passengers.some(p => p.seat === seat)) {
        button.classList.add('occupied');
      } else {
        button.addEventListener('click', () => selectSeat(trip.id, seat));
      }пусть выбранныеМеста = [];
      modalSeatMap.appendChild(button);
    });
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
  const trip = trips.find(t => t.id === parseInt(modalSeatMap.dataset.tripId));
  if (trip && trip.availableSeats >= selectedSeats.length) {
    trip.availableSeats -= selectedSeats.length;
    trip.passengers.push(...selectedSeats.map(seat => ({ phone: '+7700000000', seat, address: 'адрес' }))); // Моковый номер
    alert(`Бронь на места ${selectedSeats.join(', ')} подтверждена!`);
    selectedSeats = [];
    closeModal();
    renderDrivers();
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

// Инициализация
document.addEventListener('DOMContentLoaded', renderDrivers);

// Константы для типов авто
const carTypes = {
  sedan: { name: 'Седан', seats: 4, layout: [1, 2, 3, 4] }
};
