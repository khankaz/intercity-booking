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
