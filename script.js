const trips = JSON.parse(localStorage.getItem('trips') || '[]');
const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

// index.html — ничего

// passenger.html
if (window.location.pathname.endsWith('passenger.html')) {
  document.getElementById('searchBtn').onclick = () => {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const date = document.getElementById('date').value;
    const carType = document.getElementById('carType').value;

    const list = trips.filter(t => t.from===from && t.to===to && t.date===date && t.carType===carType);
    const cont = document.getElementById('tripsList');
    cont.innerHTML = '';
    list.forEach((t,i) => {
      const div = document.createElement('div');
      div.className='offer';
      div.innerHTML = `
        <strong>${t.from} → ${t.to} — ${t.date} ${t.time}</strong><br>
        ${t.carModel} — ${t.seatsAvailable} мест — ${t.priceSeat}₸<br>
        <button onclick="location='trip.html?id=${t.id}'">Подробнее</button>`;
      cont.appendChild(div);
    });
  };

  const url = new URL(location);
  if (url.searchParams.get('to')) {
    document.getElementById('to').value = url.searchParams.get('to');
  }
}

// driver.html
if (window.location.pathname.endsWith('driver.html')) {
  document.getElementById('driverForm').onsubmit = e => {
    e.preventDefault();
    const t = {
      id: Date.now(),
      driverName: document.getElementById('driverName').value,
      driverPhone: document.getElementById('driverPhone').value,
      carModel: document.getElementById('carModel').value,
      carType: document.getElementById('carTypeDriver').value,
      carPhoto: '', // загрузка позже
      date: document.getElementById('tripDate').value,
      time: document.getElementById('tripTime').value,
      priceSeat: +document.getElementById('priceSeat').value,
      priceSalon: +document.getElementById('priceSalon').value,
      seatsAvailable: +document.getElementById('seatsAvailable').value,
      from: '', to: '', // позже
      bookings: []
    };
    trips.push(t);
    localStorage.setItem('trips', JSON.stringify(trips));
    alert('Поездка опубликована');
  };
}

// trip.html
if (window.location.pathname.endsWith('trip.html')) {
  const t = trips.find(x=> x.id== new URL(location).searchParams.get('id'));
  document.getElementById('tripDetails').innerHTML = `
    <strong>${t.driverName}, ${t.carModel}</strong><br>
    ${t.date} ${t.time}, ${t.priceSeat}₸ за место<br>`;
  // схема салона
  const cont = document.getElementById('seatMap');
  for (let i=1; i<= (t.carType.includes('7')?7: (t.carType.includes('6')?6:4)); i++){
    const s = document.createElement('div');
    s.className = t.bookings.includes(i)?'seat booked':'seat available';
    s.textContent = i;
    s.onclick = () => {
      if(t.bookings.includes(i)) return;
      t.bookings.push(i);
      localStorage.setItem('trips', JSON.stringify(trips));
      alert('Забронировано место '+i);
    };
    cont.appendChild(s);
  }
}

