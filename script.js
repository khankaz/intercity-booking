document.addEventListener('DOMContentLoaded', () => {
  const routes = [
    { id: 1, from: "Караганда", to: "Боровое", seats: 4, booked: 2 },
    { id: 2, from: "Астана", to: "Боровое", seats: 4, booked: 1 },
    { id: 3, from: "Боровое", to: "Караганда", seats: 4, booked: 0 }
  ];

  const routeList = document.getElementById("routes");
  const routeSelect = document.getElementById("routeSelect");

  routes.forEach(route => {
    const li = document.createElement("li");
    const available = route.seats - route.booked;
    li.textContent = `${route.from} → ${route.to} | Свободных мест: ${available}`;
    routeList.appendChild(li);

    const option = document.createElement("option");
    option.value = route.id;
    option.text = `${route.from} → ${route.to}`;
    routeSelect.appendChild(option);
  });

  document.getElementById("bookingForm").addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("status").textContent = "Заявка отправлена! Мы свяжемся с вами по телефону.";
    e.target.reset();
  });
});
