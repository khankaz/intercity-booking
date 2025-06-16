// Для city.html
if (window.location.pathname.endsWith('city.html')) {
  const params = new URLSearchParams(window.location.search);
  const dest = params.get('to');
  document.getElementById('pageTitle').textContent = `Поездки в ${dest}`;

  const offers = [
    { id:1, name:'Иван', route:`Караганда → ${dest}`, date:'2025-06-20', time:'09:00', price:4000, seats:3, carType:'sedan' },
    { id:2, name:'Мария', route:`Караганда → ${dest}`, date:'2025-06-20', time:'11:30', price:4500, seats:2, carType:'crossover' }
  ];

  function renderOffers(list) {
    const cont = document.getElementById('cards');
    cont.innerHTML = '';
    list.forEach(o => {
      const div = document.createElement('div');
      div.className = 'offer-card';
      div.innerHTML = `
        <h3>${o.route}</h3>
        <p>${o.date} &nbsp; ${o.time}</p>
        <p>Кузов: ${o.carType} &nbsp; Цена: ${o.price} ₸</p>
        <p>Свободных мест: ${o.seats}</p>
        <p>Водитель: ${o.name}</p>
        <button onclick="location.href='trip.html?id=${o.id}'">Подробнее →</button>`;
      cont.appendChild(div);
    });
  }

  renderOffers(offers);
}

// Для trip.html
if (window.location.pathname.endsWith('trip.html')) {
  const params = new URLSearchParams(window.location.search);
  const id = +params.get('id');
  const trip = { id, name:'Иван', car:'Toyota Corolla', rate:4.8, reviews: 12, seats:4, booked:[1,3], othersDest:['Щучинск','Бурабай'] };

  document.getElementById('details').innerHTML = `
    <h2>${trip.name}: ${trip.car}</h2>
    <p>Рейтинг: ${trip.rate} (${trip.reviews} отзыва)</p>
    <p>Свободных мест: ${trip.seats}</p>
    <p>Другие пассажиры едут в: ${trip.othersDest.join(', ')}</p>`;

  const sc = document.getElementById('seatScheme');
  for (let i=1; i<=6; i++){
    const s = document.createElement('div');
    s.textContent = i;
    s.className = trip.booked.includes(i) ? 'seat booked' : 'seat available';
    if(!trip.booked.includes(i))
      s.onclick = ()=> alert(`Забронировали место ${i}`);
    sc.appendChild(s);
  }
}
