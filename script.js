// Моковые данные
const routes = [
  'Караганда – Астана', 'Караганда – Щучинск', 'Караганда – Бурабай',
  'Астана – Караганда', 'Щучинск – Караганда', 'Бурабай – Караганда'
];

const carTypes = {
  sedan: { name: 'Седан', seats: 4, layout: [['D', 1], [2, 3, 4]] },
  crossover: { name: 'Кроссовер', seats: 4, layout: [['D', 1], [2, 3, 4]] },
  minivan6: { name: 'Минивэн (6 мест)', seats: 6, layout: [['D', 1], [2, 3], [4, 5, 6]] },
  minivan7: { name: 'Минивэн (7 мест)', seats: 7, layout: [['D', 1], [2, 3, 4], [5, 6, 7]] }
};

let trips = [
  {
    id: 1, route: 'Караганда – Астана', date: '2025-06-16', time: '10:00', price: 5000,
    seats: 4, availableSeats: 3, car: 'sedan', status: 'pending',
    driver: { name: 'Айдос', phone: '+77012345678', experience: 5, trips: 20, rating: 4.5 },
    passengers: [{ phone: '+77098765432', seat: 1, address: 'ул. Ленина, 10' }],
    distance: '220 км', duration: '3 ч'
  },
  {
    id: 2, route: 'Бурабай – Караганда', date: '2025-06-16', time: '09:00', price: 7000,
    seats: 6, availableSeats: 6, car: 'minivan6', status: 'in_progress',
    driver: { name: 'Нурлан', phone: '+77087654321', experience: 3, trips: 10, rating: 4.0 },
    passengers: [],
    distance: '250 км', duration: '3.5 ч'
  }
];

let reviews = [
  { tripId: 1, rating: 5, comment: 'Отличный водитель, комфортная поездка!' },
  { tripId: 2, rating: 4, comment: 'Все хорошо, но немного опоздали.' }
];

let carPhotos = {
  '+77012345678': 'https://via.placeholder.com/200x150?text=Car+of+Aidos',
  '+77087654321': 'https://via.placeholder.com/200x150?text=Car+of+Nurlan'
};

let bookings = [];
let userLocation = 'Караганда';
let phone = '';
let selectedRoute = '';
let filterTime = '';
let selectedCar = '';
let pickupAddress = '';

// DOM элементы для passenger page
const tripsGrid = document.querySelector('.trips-grid') || document.createElement('div');
const phoneInput = document.querySelector('.input-field:nth-child(2)');
const routeSelect = document.querySelector('.input-field:nth-child(3)');
const timeFilter = document.querySelector('.input-field:nth-child(4)');
const carSelect = document.querySelector('.input-field:nth-child(5)');
const locationSelect = document.querySelector('.input-field:nth-child(6)');

// DOM элементы для driver-admin page
const loginPanel = document.getElementById('login-panel');
const driverPanel = document.getElementById('driver-panel');
const adminPanel = document.getElementById('admin-panel');
const loginPhone = document.getElementById('login-phone');
const loginPassword = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const driverName = document.getElementById('driver-name');
const driverPhone = document.getElementById('driver-phone');
const tripRoute = document.getElementById('trip-route');
const tripDate = document.getElementById('trip-date');
const tripTime = document.getElementById('trip-time');
const tripPrice = document.getElementById('trip-price');
const tripCar = document.getElementById('trip-car');
const addTripBtn = document.getElementById('add-trip-btn');
const myTrips = document.getElementById('my-trips');
const adminTrips = document.getElementById('admin-trips');
const bookingCount = document.getElementById('booking-count');
const newDriverPhone = document.getElementById('new-driver-phone');
const newDriverName = document.getElementById('new-driver-name');
const newDriverPassword = document.getElementById('new-driver-password');
const registerDriverBtn = document.getElementById('register-driver-btn');

let loggedInUser = null;
const users = {
  '+77012345678': { name: 'Айдос', password: '1234', role: 'driver' },
  '+77087654321': { name: 'Нурлан', password: '5678', role: 'driver' },
  'admin': { name: 'Админ', password: 'admin123', role: 'admin' }
};

// Функция рендера поездок для пассажиров
function renderPassengerTrips() {
  tripsGrid.innerHTML = '';
  const filteredTrips = trips.filter(trip => {
    const [start, end] = trip.route.split(' – ');
    const isInProgress = trip.status === 'in_progress';
    const userAtDestination = userLocation === end;
    return (
      (!selectedRoute || trip.route === selectedRoute) &&
      (!filterTime || trip.time.includes(filterTime)) &&
      (!isInProgress || (isInProgress && userAtDestination))
    );
  });

  filteredTrips.forEach(trip => {
    const tripCard = document.createElement('div');
    tripCard.className = 'trip-card';
    tripCard.innerHTML = `
      <p><strong>Маршрут:</strong> ${trip.route}</p>
      <p><strong>Дата:</strong> ${trip.date}</p>
      <p><strong>Время отправления:</strong> ${trip.time}</p>
      <p><strong>Цена:</strong> ${trip.price} KZT</p>
      <p><strong>Свободных мест:</strong> ${trip.availableSeats === 0 ? 'Мест нет' : trip.availableSeats}</p>
      <p><strong>Авто:</strong> ${carTypes[trip.car].name}</p>
      <p><strong>Водитель:</strong> ${trip.driver.name}</p>
      <p><strong>Расстояние:</strong> ${trip.distance}</p>
      <p><strong>Время в пути:</strong> ${trip.duration}</p>
      <p><strong>Статус:</strong> ${trip.status === 'pending' ? 'Ожидает' : trip.status === 'in_progress' ? 'В пути' : 'Завершено'}</p>
      <div class="driver-profile">
        ${carPhotos[trip.driver.phone] ? `<img src="${carPhotos[trip.driver.phone]}" alt="Car">` : ''}
      </div>
      <h3 class="text-lg font-semibold mt-4">Выбор места</h3>
      <input type="text" placeholder="Адрес посадки" class="input-field pickup-address" value="${pickupAddress}">
      <div class="seat-map">
        <img src="https://via.placeholder.com/300x200?text=Seating+Layout" alt="Seating Layout">
        <div class="seats" data-trip-id="${trip.id}"></div>
        <div class="legend">
          <p><span class="bg-green-500"></span> Свободно</p>
          <p><span class="bg-red-500"></span> Занято</p>
          <p><span class="bg-blue-500"></span> Выбрано</p>
          <p><span class="bg-gray-500"></span> Водитель</p>
        </div>
      </div>
      <div class="action-buttons"></div>
    `;

    const seatsContainer = tripCard.querySelector('.seats');
    const layout = carTypes[trip.car].layout;
    layout.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'row';
      row.forEach(seat => {
        const isDriver = seat === 'D';
        const isTaken = !isDriver && trip.passengers.some(p => p.seat === seat);
        const button = document.createElement('button');
        button.textContent = seat === 'D' ? 'D' : seat;
        button.className = `seat ${isDriver ? 'bg-gray-500' : isTaken ? 'bg-red-500' : 'bg-green-500'}`;
        if (!isDriver && !isTaken) {
          button.addEventListener('click', () => selectSeat(trip.id, seat));
        }
        rowDiv.appendChild(button);
      });
      seatsContainer.appendChild(rowDiv);
    });

    const actionButtons = tripCard.querySelector('.action-buttons');
    if (trip.availableSeats > 0 && trip.status !== 'completed') {
      if (selectedSeat && selectedSeat.tripId === trip.id) {
        const bookSeatBtn = document.createElement('button');
        bookSeatBtn.textContent = `Забронировать место ${selectedSeat.seat}`;
        bookSeatBtn.className = 'btn book-seat';
        bookSeatBtn.addEventListener('click', () => bookSeat(trip.id, selectedSeat.seat));
        actionButtons.appendChild(bookSeatBtn);
      }
      if (trip.availableSeats === carTypes[trip.car].seats) {
        const bookSalonBtn = document.createElement('button');
        bookSalonBtn.textContent = 'Салон';
        bookSalonBtn.className = 'btn book-salon';
        bookSalonBtn.addEventListener('click', () => bookFullSalon(trip.id));
        actionButtons.appendChild(bookSalonBtn);
      }
    }

    const reviewsSection = document.createElement('div');
    reviewsSection.innerHTML = `
      <h3 class="text-lg font-semibold mt-4">Отзывы</h3>
      ${reviews.filter(r => r.tripId === trip.id).map(r => `
        <div class="mt-2">
          <p><strong>Рейтинг:</strong> ${r.rating} ★</p>
          <p>${r.comment}</p>
        </div>
      `).join('')}
      ${trip.status === 'completed' ? `
        <div class="mt-4">
          <h4 class="text-lg font-semibold">Оставить отзыв</h4>
          <select class="input-field review-rating">
            <option value="">Выберите рейтинг</option>
            <option value="1">1 ★</option>
            <option value="2">2 ★</option>
            <option value="3">3 ★</option>
            <option value="4">4 ★</option>
            <option value="5">5 ★</option>
          </select>
        </div>
      ` : ''}
    `;
    tripCard.appendChild(reviewsSection);

    tripsGrid.appendChild(tripCard);
  });
}

// Функция рендера панели водителя
function renderDriverPanel() {
  driverName.textContent = users[loggedInUser].name;
  driverPhone.textContent = loggedInUser;
  myTrips.innerHTML = '';
  const driverTrips = trips.filter(t => t.driver.phone === loggedInUser);
  driverTrips.forEach(trip => {
    const tripCard = document.createElement('div');
    tripCard.className = 'trip-card';
    tripCard.innerHTML = `
      <p><strong>Маршрут:</strong> ${trip.route}</p>
      <p><strong>Статус:</strong> ${trip.status === 'pending' ? 'Ожидает' : trip.status === 'in_progress' ? 'В пути' : 'Завершено'}</p>
      <p><strong>Пассажиры:</strong> ${trip.passengers.length} / ${trip.seats}</p>
      <div class="seat-map">
        <img src="https://via.placeholder.com/300x200?text=Seating+Layout" alt="Seating Layout">
        <div class="seats" data-trip-id="${trip.id}"></div>
      </div>
      ${trip.passengers.map(p => `<p>Место ${p.seat}: ${p.phone}, ${p.address}</p>`).join('')}
      ${trip.status === 'pending' ? '<button class="btn start-trip-btn">Старт</button>' : ''}
      ${trip.status === 'in_progress' ? `
        <div class="action-buttons">
          <button class="btn in-progress-btn">В пути</button>
          <button class="btn complete-trip-btn">Завершено</button>
        </div>
      ` : ''}
    `;
    const seatsContainer = tripCard.querySelector('.seats');
    const layout = carTypes[trip.car].layout;
    layout.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'row';
      row.forEach(seat => {
        const isDriver = seat === 'D';
        const isTaken = trip.passengers.some(p => p.seat === seat);
        const button = document.createElement('button');
        button.textContent = seat === 'D' ? 'D' : seat;
        button.className = `seat ${isDriver ? 'bg-gray-500' : isTaken ? 'bg-red-500' : 'bg-green-500'}`;
        rowDiv.appendChild(button);
      });
      seatsContainer.appendChild(rowDiv);
    });
    myTrips.appendChild(tripCard);
  });
  driverPanel.classList.add('active');
}

// Функция рендера панели админа
function renderAdminPanel() {
  bookingCount.textContent = bookings.length;
  adminTrips.innerHTML = '';
  trips.forEach(trip => {
    const tripCard = document.createElement('div');
    tripCard.className = 'trip-card';
    tripCard.innerHTML = `
      <p><strong>Маршрут:</strong> ${trip.route}</p>
      <p><strong>Водитель:</strong> ${trip.driver.name}</p>
      <input type="number" placeholder="Установить цену (KZT)" class="input-field price-input" value="${trip.price}">
      <input type="file" accept="image/*" class="photo-upload">
      <button class="btn delete-btn">Удалить</button>
    `;
    adminTrips.appendChild(tripCard);
  });
  adminPanel.classList.add('active');
}

// Выбор места
let selectedSeat = null;
function selectSeat(tripId, seat) {
  selectedSeat = { tripId, seat };
  renderPassengerTrips();
}

// Бронирование места
async function bookSeat(tripId, seat) {
  if (!await verifyPhone(phone)) {
    alert('Ошибка проверки номера телефона');
    return;
  }
  const trip = trips.find(t => t.id === tripId);
  if (trip.availableSeats > 0) {
    trip.availableSeats--;
    trip.passengers.push({ phone, seat, address: pickupAddress });
    bookings.push({ tripId, phone, seat, address: pickupAddress, status: 'confirmed' });
    alert(`Бронь на место ${seat} подтверждена! Уведомление отправлено через WhatsApp/Telegram.`);
    selectedSeat = null;
    renderPassengerTrips();
  }
}

// Бронирование салона
async function bookFullSalon(tripId) {
  if (!await verifyPhone(phone)) {
    alert('Ошибка проверки номера телефона');
    return;
  }
  const trip = trips.find(t => t.id === tripId);
  if (trip.availableSeats === carTypes[trip.car].seats) {
    trip.availableSeats = 0;
    trip.passengers = Array.from({ length: trip.seats - 1 }, (_, i) => ({ phone, seat: i + 1, address: pickupAddress }));
    bookings.push({ tripId, phone, address: pickupAddress, status: 'confirmed', fullSalon: true });
    alert('Весь салон забронирован! Уведомление отправлено через WhatsApp/Telegram.');
    renderPassengerTrips();
  } else {
    alert('Бронирование салона возможно только если все места свободны.');
  }
}

// Добавление поездки
async function addTrip() {
  if (!await verifyPhone(loggedInUser)) {
    alert('Ошибка проверки номера телефона');
    return;
  }
  const newTrip = {
    id: trips.length + 1,
    route: tripRoute.value,
    date: tripDate.value,
    time: tripTime.value,
    price: parseInt(tripPrice.value) || 5000,
    seats: parseInt(carTypes[tripCar.value].seats),
    availableSeats: parseInt(carTypes[tripCar.value].seats),
    car: tripCar.value,
    status: 'pending',
    driver: { name: users[loggedInUser].name, phone: loggedInUser, experience: 0, trips: 0, rating: 0 },
    passengers: [],
    distance: tripRoute.value.includes('Астана') ? '220 км' : '250 км',
    duration: tripRoute.value.includes('Астана') ? '3 ч' : '3.5 ч'
  };
  trips.push(newTrip);
  alert('Поездка добавлена!');
  renderDriverPanel();
}

// Регистрация водителя
function registerDriver() {
  const phone = newDriverPhone.value;
  const name = newDriverName.value;
  const password = newDriverPassword.value;
  if (phone && name && password) {
    users[phone] = { name, password, role: 'driver' };
    alert('Водитель зарегистрирован!');
    newDriverPhone.value = '';
    newDriverName.value = '';
    newDriverPassword.value = '';
  }
}

// Обработка загрузки фото
function handlePhotoUpload(event, driverPhone) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      carPhotos[driverPhone] = reader.result;
      renderPassengerTrips();
      renderDriverPanel();
      renderAdminPanel();
    };
    reader.readAsDataURL(file);
  }
}

// Проверка номера телефона (заглушка)
async function verifyPhone(phoneNumber) {
  console.log(`Отправка SMS на ${phoneNumber}...`);
  return true;
}

// Обработчики событий для passenger page
phoneInput.addEventListener('input', (e) => { phone = e.target.value; });
routeSelect.addEventListener('change', (e) => { selectedRoute = e.target.value; renderPassengerTrips(); });
timeFilter.addEventListener('input', (e) => { filterTime = e.target.value; renderPassengerTrips(); });
carSelect.addEventListener('change', (e) => { selectedCar = e.target.value; renderPassengerTrips(); });
locationSelect.addEventListener('change', (e) => { userLocation = e.target.value; renderPassengerTrips(); });

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('review-rating')) {
    const select = e.target;
    const rating = parseInt(select.value);
    if (rating) {
      const comment = prompt('Введите комментарий:');
      if (comment) {
        const tripId = e.target.closest('.trip-card').querySelector('.seats').dataset.tripId;
        reviews.push({ tripId, rating, comment });
        alert('Отзыв добавлен!');
        renderPassengerTrips();
      }
    }
  }
  if (e.target.classList.contains('pickup-address')) {
    pickupAddress = e.target.value;
  }
  if (e.target.classList.contains('book-seat')) {
    const tripId = e.target.closest('.trip-card').querySelector('.seats').dataset.tripId;
    bookSeat(tripId, selectedSeat.seat);
  }
  if (e.target.classList.contains('book-salon')) {
    const tripId = e.target.closest('.trip-card').querySelector('.seats').dataset.tripId;
    bookFullSalon(tripId);
  }
});

// Обработчики событий для driver-admin page
loginBtn.addEventListener('click', () => {
  const phone = loginPhone.value;
  const password = loginPassword.value;
  if (users[phone] && users[phone].password === password) {
    loggedInUser = phone;
    loginPanel.classList.remove('active');
    setTimeout(() => {
      loginPanel.style.display = 'none';
      if (users[phone].role === 'driver') {
        driverPanel.style.display = 'block';
        setTimeout(() => renderDriverPanel(), 50);
      } else if (users[phone].role === 'admin') {
        adminPanel.style.display = 'block';
        setTimeout(() => renderAdminPanel(), 50);
      }
    }, 300);
  } else {
    alert('Неверный номер телефона или пароль.');
  }
});

logoutBtn.addEventListener('click', () => {
  driverPanel.classList.remove('active');
  adminPanel.classList.remove('active');
  setTimeout(() => {
    driverPanel.style.display = 'none';
    adminPanel.style.display = 'none';
    loggedInUser = null;
    loginPanel.style.display = 'block';
    setTimeout(() => loginPanel.classList.add('active'), 50);
  }, 300);
});

addTripBtn.addEventListener('click', addTrip);

registerDriverBtn.addEventListener('click', registerDriver);

document.addEventListener('change', (e) => {
  if (e.target.classList.contains('photo-upload')) {
    const tripCard = e.target.closest('.trip-card');
    const driverPhone = tripCard.querySelector('p').textContent.split(': ')[1];
    handlePhotoUpload(e, driverPhone);
  }
  if (e.target.classList.contains('price-input')) {
    const tripCard = e.target.closest('.trip-card');
    const tripId = trips.findIndex(t => t.driver.name === tripCard.querySelector('p').textContent.split(': ')[1]);
    trips[tripId].price = parseInt(e.target.value) || trips[tripId].price;
    renderAdminPanel();
  }
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('start-trip-btn')) {
    const tripId = e.target.closest('.trip-card').querySelector('.seats').dataset.tripId;
    trips.find(t => t.id === parseInt(tripId)).status = 'in_progress';
    renderDriverPanel();
  }
  if (e.target.classList.contains('in-progress-btn')) {
    const tripId = e.target.closest('.trip-card').querySelector('.seats').dataset.tripId;
    trips.find(t => t.id === parseInt(tripId)).status = 'in_progress';
    renderDriverPanel();
  }
  if (e.target.classList.contains('complete-trip-btn')) {
    const tripId = e.target.closest('.trip-card').querySelector('.seats').dataset.tripId;
    trips.find(t => t.id === parseInt(tripId)).status = 'completed';
    renderDriverPanel();
  }
  if (e.target.classList.contains('delete-btn')) {
    const tripCard = e.target.closest('.trip-card');
    const driverName = tripCard.querySelector('p').textContent.split(': ')[1];
    const tripId = trips.findIndex(t => t.driver.name === driverName);
    trips.splice(tripId, 1);
    renderAdminPanel();
  }
});

// Инициализация
if (window.location.pathname.includes('driver-admin.html')) {
  if (!loggedInUser) {
    loginPanel.style.display = 'block';
    loginPanel.classList.add('active');
  } else if (users[loggedInUser].role === 'driver') {
    driverPanel.style.display = 'block';
    renderDriverPanel();
  } else if (users[loggedInUser].role === 'admin') {
    adminPanel.style.display = 'block';
    renderAdminPanel();
  }
} else {
  renderPassengerTrips();
}
