// Авторизация
const access = prompt("Введите админ-пароль:");
if (access !== "1234") {
  alert("Доступ запрещён");
  document.body.innerHTML = "<h2 style='text-align:center;color:red'>Нет доступа</h2>";
  throw new Error("Unauthorized");
}

// Загрузка данных
let passengers = JSON.parse(localStorage.getItem("passengers")) || [];
let drivers = JSON.parse(localStorage.getItem("drivers")) || [];

const passengerList = document.getElementById("passengerList");
const driverList = document.getElementById("driverList");

function render() {
  passengerList.innerHTML = "";
  driverList.innerHTML = "";

  passengers.forEach((p, i) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div id="pView${i}">
        <strong>${p.name}</strong> (${p.phone})<br>
        Маршрут: ${p.route} — Место посадки: ${p.pickup}<br>
        Дата: ${p.date} — Место: ${p.seat}<br>
        <button onclick="editPassenger(${i})">✏️ Редактировать</button>
        <button onclick="removePassenger(${i})">🗑 Удалить</button>
      </div>

      <div id="pEdit${i}" style="display:none;">
        <input value="${p.name}" id="pname${i}"> 
        <input value="${p.phone}" id="pphone${i}"><br>
        <input value="${p.route}" id="proute${i}">
        <input value="${p.pickup}" id="ppickup${i}"><br>
        <input value="${p.date}" id="pdate${i}">
        <input value="${p.seat}" id="pseat${i}"><br>
        <button onclick="savePassenger(${i})">✅ Сохранить</button>
        <button onclick="cancelEditPassenger(${i})">❌ Отмена</button>
      </div>
    `;

    passengerList.appendChild(li);
  });

  drivers.forEach((d, i) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div id="dView${i}">
        <strong>${d.driverName}</strong> (${d.driverPhone})<br>
        Маршрут: ${d.route}<br>
        Дата: ${d.date} — Время: ${d.time}<br>
        <button onclick="editDriver(${i})">✏️ Редактировать</button>
        <button onclick="removeDriver(${i})">🗑 Удалить</button>
      </div>

      <div id="dEdit${i}" style="display:none;">
        <input value="${d.driverName}" id="dname${i}">
        <input value="${d.driverPhone}" id="dphone${i}"><br>
        <input value="${d.route}" id="droute${i}">
        <input value="${d.date}" id="ddate${i}">
        <input value="${d.time}" id="dtime${i}"><br>
        <button onclick="saveDriver(${i})">✅ Сохранить</button>
        <button onclick="cancelEditDriver(${i})">❌ Отмена</button>
      </div>
    `;

    driverList.appendChild(li);
  });
}

// Удаление
function removePassenger(index) {
  passengers.splice(index, 1);
  localStorage.setItem("passengers", JSON.stringify(passengers));
  render();
}

function removeDriver(index) {
  drivers.splice(index, 1);
  localStorage.setItem("drivers", JSON.stringify(drivers));
  render();
}

// Редактирование пассажира
function editPassenger(i) {
  document.getElementById(`pView${i}`).style.display = "none";
  document.getElementById(`pEdit${i}`).style.display = "block";
}
function cancelEditPassenger(i) {
  document.getElementById(`pView${i}`).style.display = "block";
  document.getElementById(`pEdit${i}`).style.display = "none";
}
function savePassenger(i) {
  passengers[i] = {
    name: document.getElementById(`pname${i}`).value,
    phone: document.getElementById(`pphone${i}`).value,
    route: document.getElementById(`proute${i}`).value,
    pickup: document.getElementById(`ppickup${i}`).value,
    date: document.getElementById(`pdate${i}`).value,
    seat: document.getElementById(`pseat${i}`).value,
  };
  localStorage.setItem("passengers", JSON.stringify(passengers));
  render();
}

// Редактирование водителя
function editDriver(i) {
  document.getElementById(`dView${i}`).style.display = "none";
  document.getElementById(`dEdit${i}`).style.display = "block";
}
function cancelEditDriver(i) {
  document.getElementById(`dView${i}`).style.display = "block";
  document.getElementById(`dEdit${i}`).style.display = "none";
}
function saveDriver(i) {
  drivers[i] = {
    driverName: document.getElementById(`dname${i}`).value,
    driverPhone: document.getElementById(`dphone${i}`).value,
    route: document.getElementById(`droute${i}`).value,
    date: document.getElementById(`ddate${i}`).value,
    time: document.getElementById(`dtime${i}`).value,
  };
  localStorage.setItem("drivers", JSON.stringify(drivers));
  render();
}

// Перерисовать при загрузке
render();
