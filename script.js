// Пассажир
const passengerForm = document.getElementById("passengerForm");
if (passengerForm) {
  passengerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const pickup = document.getElementById("pickup").value;
    const route = document.getElementById("route").value;
    const date = document.getElementById("date").value;
    const seat = document.getElementById("seat").value;

    console.log("📦 Заявка пассажира:", { name, phone, pickup, route, date, seat });

    document.getElementById("status").textContent = "Заявка отправлена! Ожидайте подтверждения.";
    passengerForm.reset();
  });
}

// Водитель
const driverForm = document.getElementById("driverForm");
if (driverForm) {
  driverForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const driverName = document.getElementById("driverName").value;
    const driverPhone = document.getElementById("driverPhone").value;
    const route = document.getElementById("route").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    console.log("🚗 Поездка водителя:", { driverName, driverPhone, route, date, time });

    document.getElementById("driverStatus").textContent = "Поездка добавлена!";
    driverForm.reset();
  });
}
