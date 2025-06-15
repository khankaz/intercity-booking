// Авторизация через код
const sendCodeBtn = document.getElementById("sendCode");
const authForm = document.getElementById("authForm");

if (sendCodeBtn && authForm) {
  let generatedCode = null;

  sendCodeBtn.addEventListener("click", () => {
    const phone = document.getElementById("phone").value;
    if (!phone) {
      alert("Введите номер телефона");
      return;
    }

    generatedCode = Math.floor(100000 + Math.random() * 900000); // 6-значный код
    console.log("Код для WhatsApp:", generatedCode); // ⚠️ Здесь интеграция с WhatsApp API позже

    document.getElementById("code").style.display = "block";
    document.getElementById("loginButton").style.display = "block";
    document.getElementById("authStatus").textContent = "Код отправлен. Введите его ниже.";
  });

  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userCode = document.getElementById("code").value;
    if (userCode == generatedCode) {
      document.getElementById("authStatus").textContent = "Успешный вход!";
      // Перенаправить на нужную страницу
      window.location.href = "index.html"; // или другой путь
    } else {
      document.getElementById("authStatus").textContent = "Неверный код, попробуйте ещё раз.";
    }
  });
}
// Сохраняем заявки пассажиров
if (passengerForm) {
  passengerForm.addEventListener("submit", function () {
    const passengers = JSON.parse(localStorage.getItem("passengers")) || [];
    passengers.push({ name, phone, pickup, route, date, seat });
    localStorage.setItem("passengers", JSON.stringify(passengers));
  });
}

// Сохраняем поездки водителей
if (driverForm) {
  driverForm.addEventListener("submit", function () {
    const drivers = JSON.parse(localStorage.getItem("drivers")) || [];
    drivers.push({ driverName, driverPhone, route, date, time });
    localStorage.setItem("drivers", JSON.stringify(drivers));
  });
}
