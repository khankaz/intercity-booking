// Простая защита
const access = prompt("Введите админ-пароль:");
if (access !== "1234") {
  alert("Доступ запрещён");
  document.body.innerHTML = "<h2 style='text-align:center;color:red'>Нет доступа</h2>";
  throw new Error("Unauthorized");
}

// Загрузка данных
const passengers = JSON.parse(localStorage.getItem("passengers")) || [];
const drivers = JSON.parse(localStorage.getItem("drivers")) || [];

const passengerList = document.getElementById("passengerList");
const driverList = document.getElementById("driverList");

// Отображение пассажиров
passengers.forEach((p, i) => {
  const li = document.createElement("li");
  li.innerHTML = `
    <strong>${p.name}</strong> (${p.phone})<br>
    Маршрут: ${p.route} — Место посадки: ${p.pickup}<br>
    Дата: ${p.date} — Место: ${p.seat}
    <button onclick="removePassenger(${i})">Удалить</button>
  `;
  passengerList.appendChild(li);
});

// Отображение водителей
drivers.forEach((d, i) => {
  const li = document.createElement("li");
  li.innerHTML = `
    <strong>${d.driverName}</strong> (${d.driverPhone})<br>
    Маршрут: ${d.route} — ${d.date} ${d.time}
    <button onclick="removeDriver(${i})">Удалить</button>
  `;
  driverList.appendChild(li);
});

// Удаление
function removePassenger(index) {
  passengers.splice(index, 1);
  localStorage.setItem("passengers", JSON.stringify(passengers));
  location.reload();
}

function removeDriver(index) {
  drivers.splice(index, 1);
  localStorage.setItem("drivers", JSON.stringify(drivers));
  location.reload();
}
