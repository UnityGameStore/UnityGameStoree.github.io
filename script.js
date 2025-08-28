// ====================
// MENÚ HAMBURGUESA
// ====================
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener('click', () => mobileMenu.classList.toggle('active'));
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('active'));
  });
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && e.target !== hamburgerBtn) {
      mobileMenu.classList.remove('active');
    }
  });
}

// ====================
// CARRITO POPUP
// ====================
const cartBtn = document.getElementById("cart-btn");
const cartPopup = document.getElementById("cart-popup");
const cartItems = document.getElementById("cart-items");
let carrito = [];
cartBtn.addEventListener("click", () => {
  cartPopup.style.display = cartPopup.style.display === "block" ? "none" : "block";
});
function actualizarCarrito() {
  cartItems.innerHTML = "";
  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.producto} - ${item.precio}`;
    cartItems.appendChild(li);
  });
}

// ====================
// SLIDER
// ====================
const slides = document.querySelector(".slides");
const slideImages = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
let index = 0;
function showSlide(i) {
  index += i;
  if (index < 0) index = slideImages.length - 1;
  if (index >= slideImages.length) index = 0;
  slides.style.transform = `translateX(${-index * 100}%)`;
}
prevBtn.addEventListener("click", () => showSlide(-1));
nextBtn.addEventListener("click", () => showSlide(1));
setInterval(() => { showSlide(1); }, 5000);

// ====================
// BÚSQUEDA GLOBAL
// ====================
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
function filtrarProductos() {
  const query = searchInput.value.trim().toLowerCase();
  document.querySelectorAll(".product-card").forEach(card => {
    const nombre = card.querySelector("h4")?.innerText.toLowerCase() || "";
    card.style.display = nombre.includes(query) ? "" : "none";
  });
}
searchInput.addEventListener("input", filtrarProductos);
searchBtn.addEventListener("click", filtrarProductos);

// ====================
// PLAYSTATION TABS Y RENDER
// ====================
const btnPsTodos = document.getElementById('btn-ps-todos');
const btnPsOfertas = document.getElementById('btn-ps-ofertas');
const psTodosContainer = document.getElementById('playstation-products');
const psOfertasContainer = document.getElementById('ofertas-products');
if (btnPsTodos && btnPsOfertas && psTodosContainer && psOfertasContainer) {
  btnPsTodos.addEventListener('click', () => {
    btnPsTodos.classList.add('active');
    btnPsOfertas.classList.remove('active');
    psTodosContainer.style.display = '';
    psOfertasContainer.style.display = 'none';
  });
  btnPsOfertas.addEventListener('click', () => {
    btnPsTodos.classList.remove('active');
    btnPsOfertas.classList.add('active');
    psTodosContainer.style.display = 'none';
    psOfertasContainer.style.display = '';
  });
}

// ====================
// CARGA PLAYSTATION Y OFERTAS
// ====================
function renderProductoCard(prod, idx, container, tipo) {
  if (!prod.nombre) return;
  const tienePS4 = prod.ps4 !== "" && prod.ps4 !== undefined;
  const tienePS5 = prod.ps5 !== "" && prod.ps5 !== undefined;
  const tieneSecundario = prod.secundario !== "" && prod.secundario !== undefined;
  if (!tienePS4 && !tienePS5 && !tieneSecundario) return;
  const prodId = `${tipo}-prod-${idx}`;
  let plataformaOptions = '';
  if (tienePS4) plataformaOptions += `<option value="ps4">PS4</option>`;
  if (tienePS5) plataformaOptions += `<option value="ps5">PS5</option>`;
  let tipoOptions = '<option value="principal">Principal</option>';
  if (tieneSecundario) tipoOptions += `<option value="secundario">Secundario</option>`;
  let precioInicial = tienePS4 ? prod.ps4 : (tienePS5 ? prod.ps5 : prod.secundario);
  container.innerHTML += `
    <div class="product-card">
      <h4>${prod.nombre}</h4>
      <label>
        Plataforma:
        <select class="select-plataforma" data-prod="${prodId}">
          ${plataformaOptions}
        </select>
      </label>
      <label>
        Tipo:
        <select class="select-tipo" data-prod="${prodId}">
          ${tipoOptions}
        </select>
      </label>
      <p class="price" id="price-${prodId}">$${precioInicial}</p>
      <button class="btn-carrito-${tipo}" data-idx="${idx}">Añadir al carrito</button>
    </div>
  `;

  setTimeout(() => {
    const selectPlataforma = document.querySelector(`.select-plataforma[data-prod="${prodId}"]`);
    const selectTipo = document.querySelector(`.select-tipo[data-prod="${prodId}"]`);
    const priceTag = document.getElementById(`price-${prodId}`);
    if (!selectTipo || !priceTag) return;
    function actualizarPrecio() {
      const plat = selectPlataforma ? selectPlataforma.value : '';
      const tipoSel = selectTipo.value;
      let precio = '';
      if (tipoSel === 'secundario' && prod.secundario) precio = prod.secundario;
      else if (plat === 'ps4' && prod.ps4) precio = prod.ps4;
      else if (plat === 'ps5' && prod.ps5) precio = prod.ps5;
      else if (prod.ps4) precio = prod.ps4;
      else if (prod.ps5) precio = prod.ps5;
      else if (prod.secundario) precio = prod.secundario;
      priceTag.textContent = precio ? `$${precio}` : 'Sin stock';
    }
    if (selectPlataforma) selectPlataforma.addEventListener('change', actualizarPrecio);
    selectTipo.addEventListener('change', actualizarPrecio);

    const btnCarrito = document.querySelector(`.btn-carrito-${tipo}[data-idx="${idx}"]`);
    if (btnCarrito) {
      btnCarrito.addEventListener('click', () => {
        const plat = selectPlataforma ? selectPlataforma.value : '';
        const tipoSel = selectTipo.value;
        let precio = '';
        if (tipoSel === 'secundario' && prod.secundario) precio = prod.secundario;
        else if (plat === 'ps4' && prod.ps4) precio = prod.ps4;
        else if (plat === 'ps5' && prod.ps5) precio = prod.ps5;
        else if (prod.ps4) precio = prod.ps4;
        else if (prod.ps5) precio = prod.ps5;
        else if (prod.secundario) precio = prod.secundario;
        if (!precio) {
          alert('Sin stock para esta combinación.');
          return;
        }
        carrito.push({ producto: `${prod.nombre} (${plat.toUpperCase()} - ${tipoSel})`, precio: `$${precio}` });
        actualizarCarrito();
      });
    }
  }, 0);
}

function cargarPlayStation() {
  fetch('csvjson.json')
    .then(res => res.json())
    .then(productos => {
      psTodosContainer.innerHTML = '';
      productos.forEach((prod, idx) => renderProductoCard(prod, idx, psTodosContainer, 'ps'));
    });
}
function cargarOfertas() {
  fetch('ofertas.json')
    .then(res => res.json())
    .then(productos => {
      psOfertasContainer.innerHTML = '';
      productos.forEach((prod, idx) => renderProductoCard(prod, idx, psOfertasContainer, 'oferta'));
    });
}
if (psTodosContainer) cargarPlayStation();
if (psOfertasContainer) cargarOfertas();

// ====================
// BOTÓN DE COMPRA
// ====================
const checkoutBtn = document.getElementById("checkout");
checkoutBtn.addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }
  let mensaje = "Hola! Quiero comprar:\n\n";
  carrito.forEach(item => {
    mensaje += `- ${item.producto} (${item.precio})\n`;
  });
  const url = `https://wa.me/123456789?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
});
