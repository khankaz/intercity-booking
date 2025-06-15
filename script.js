const carLayouts = {
  sedan: ['1', '2', '3', '4', '5'], // без водителя
  crossover: ['1', '2', '3', '4', '5'],
  crossover6: ['1', '2', '3', '4', '5', '6'],
  minivan6: ['1', '2', '3', '4', '5', '6'],
  minivan7: ['1', '2', '3', '4', '5', '6', '7'],
};

const bookedSeats = {}; // структура хранения брони

const form = document.getElementById("bookingForm");
const seatContainer = document.getElementById("seatMapContainer");
const selectedSeatInput = document.getElementById("selectedSeat");
const carTypeSelect = document.getElementById("carType");
const routeSelect = document.getElementById("routeSelect");

function getRouteKey() {
  return `${routeSelect.value}-${carTypeSelect.value}`;
}

function generateSeats(carType) {
  const routeKey = getRouteKey();
  const layout = carLayouts[carType];
  seatContainer.innerHTML = '<p>Выберите место:</p><div class="seats">';

  layout.forEach((seat) => {
    const isBooked = bookedSeats[routeKey]?.includes(seat);
    const seatDiv = document.createElement('div');
    seatDiv.className = `seat ${isBooked ? 'booked' : ''}`;
    seatDiv.textContent = seat;
    seatDiv.dataset.seat = seat;
    if (!isBooked) {
      seatDiv.addEventListener('click', () => {
        document.querySelectorAll('.seat').forEach(s => s.classList.remove('selected'));
        seatDiv.classList.add('selected');
        selectedSeatInput.value = seat;
      });
    }
    seatContainer.querySelector('.seats')?.appendChild(seatDiv);
  });

  seatContainer.innerHTML += '</div>';
}

carTypeSelect.addEventListener("change", () => {
  generateSeats(carTypeSelect.value);
});

routeSelect.addEventListener("change", () => {
  generateSeats(carTypeSelect.value);
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const routeKey = getRouteKey();
  const seat = selectedSeatInput.value;
  if (!seat) {
    alert("Выберите место.");
    return;
  }

  bookedSeats[routeKey] = bookedSeats[routeKey] || [];
  if (!bookedSeats[routeKey].includes(seat)) {
    bookedSeats[routeKey].push(seat);
    document.getElementById("status").textContent = "Место успешно забронировано.";
    generateSeats(carTypeSelect.value);
    form.reset();
  } else {
    document.getElementById("status").textContent = "Место уже занято.";
  }
});

document.getElementById("salonButton").addEventListener("click", function () {
  const routeKey = getRouteKey();
  const layout = carLayouts[carTypeSelect.value];
  bookedSeats[routeKey] = [...layout];
  document.getElementById("status").textContent = "Весь салон успешно забронирован.";
  generateSeats(carTypeSelect.value);
  form.reset();
});
