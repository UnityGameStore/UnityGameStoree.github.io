// ==============================
// VARIABLES DEL CARRITO
// ==============================
let cart = [];

// Añadir producto simple
function addToCart(name, price) {
  cart.push({ name, price });
  updateCartCount();
}

// Actualizar contador carrito
function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
}

// Añadir Gift Card (con select de montos)
function addGiftCard(button) {
  const select = button.previousElementSibling;
  const option = select.value.split("-");
  const label = option[0];
  const price = parseFloat(option[1]);

  cart.push({ name: "Gift Card " + label, price });
  updateCartCount();
}

// ==============================
// CHECKOUT POR WHATSAPP
// ==============================
function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  let message = "🛒 *Pedido Unity Game Store*%0A%0A";
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} - $${item.price}%0A`;
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  message += `%0A*Total:* $${total}`;

  // Reemplaza este número por el tuyo
  const phone = "584122754616";
  const url = `https://wa.me/${phone}?text=${message}`;

  window.open(url, "_blank");
}

// ==============================
// SLIDER AUTOMÁTICO
// ==============================
let currentSlide = 0;

function showSlide(index) {
  const slides = document.querySelectorAll(".slide");
  const slidesContainer = document.querySelector(".slides");

  if (index >= slides.length) currentSlide = 0;
  else if (index < 0) currentSlide = slides.length - 1;
  else currentSlide = index;

  slidesContainer.style.transform = "translateX(" + (-currentSlide * 100) + "%)";
}

// Botones slider
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".next").addEventListener("click", () => showSlide(currentSlide + 1));
  document.querySelector(".prev").addEventListener("click", () => showSlide(currentSlide - 1));

  // Auto play
  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5000);
});

// ==============================
// BOTÓN DE CHECKOUT
// ==============================
// Puedes poner este botón en el HTML donde quieras:
// <button onclick="checkoutWhatsApp()">Finalizar compra</button>
