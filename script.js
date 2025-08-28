// ====================
// CARRITO POPUP
// ====================
const cartBtn = document.getElementById("cart-btn");
const cartPopup = document.getElementById("cart-popup");

cartBtn.addEventListener("click", () => {
  cartPopup.style.display = cartPopup.style.display === "block" ? "none" : "block";
});

// ====================
// AGREGAR AL CARRITO
// ====================
const cartItems = document.getElementById("cart-items");
let carrito = [];

function actualizarCarrito() {
  cartItems.innerHTML = "";
  carrito.forEach((item, i) => {
    const li = document.createElement("li");
    li.textContent = `${item.producto} - ${item.precio}`;
    cartItems.appendChild(li);
  });
}

// ====================
// MENÚ HAMBURGUESA PARA MÓVIL
// ====================
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');

// Abrir/cerrar el menú
if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  // Cerrar al hacer click en un enlace
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  });

  // Opcional: cerrar si haces click fuera del menú
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && e.target !== hamburgerBtn) {
      mobileMenu.classList.remove('active');
    }
  });
}

// ====================
// PRODUCTOS PLAYSTATION DESDE JSON SOLO SE MUESTRAN EN PLAYSTATION
// ====================
function cargarPlayStation() {
  fetch('csvjson.json')
    .then(res => res.json())
    .then(productos => {
      // Eliminar duplicados por nombre (quédate solo con la primera aparición)
      const juegoMap = {};
      productos.forEach(prod => {
        if (prod.nombre && !juegoMap[prod.nombre]) {
          juegoMap[prod.nombre] = prod;
        }
      });
      const unicos = Object.values(juegoMap);
      renderPlaystationProductos(unicos);
    });
}

function renderPlaystationProductos(productos) {
  const container = document.getElementById('playstation-products');
  container.innerHTML = '';
  productos.forEach((prod, idx) => {
    if (!prod.nombre) return;

    // Validar si tiene al menos una versión
    const tienePS4 = prod.ps4 !== "" && prod.ps4 !== undefined;
    const tienePS5 = prod.ps5 !== "" && prod.ps5 !== undefined;
    const tieneSecundario = prod.secundario !== "" && prod.secundario !== undefined;
    if (!tienePS4 && !tienePS5 && !tieneSecundario) return;

    const prodId = `ps-prod-${idx}`;
    let plataformaOptions = '';
    if (tienePS4) plataformaOptions += `<option value="ps4">PS4</option>`;
    if (tienePS5) plataformaOptions += `<option value="ps5">PS5</option>`;

    // Menú de tipo
    let tipoOptions = '<option value="principal">Principal</option>';
    if (tieneSecundario) tipoOptions += `<option value="secundario">Secundario</option>`;

    // Precio inicial
    let precioInicial = "";
    if (tienePS4) precioInicial = prod.ps4;
    else if (tienePS5) precioInicial = prod.ps5;
    else if (tieneSecundario) precioInicial = prod.secundario;

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
        <button class="btn-carrito-ps" data-idx="${idx}">Añadir al carrito</button>
      </div>
    `;
  });

  // Listeners para selects y botón
  productos.forEach((prod, idx) => {
    if (!prod.nombre) return;
    const prodId = `ps-prod-${idx}`;
    const selectPlataforma = document.querySelector(`.select-plataforma[data-prod="${prodId}"]`);
    const selectTipo = document.querySelector(`.select-tipo[data-prod="${prodId}"]`);
    const priceTag = document.getElementById(`price-${prodId}`);
    if (!selectTipo || !priceTag) return;

    function actualizarPrecio() {
      const plat = selectPlataforma ? selectPlataforma.value : '';
      const tipo = selectTipo.value;
      let precio = '';
      if (tipo === 'secundario' && prod.secundario !== "") {
        precio = prod.secundario;
      } else if (plat === 'ps4' && prod.ps4 !== "") {
        precio = prod.ps4;
      } else if (plat === 'ps5' && prod.ps5 !== "") {
        precio = prod.ps5;
      } else if (prod.ps4 !== "") {
        precio = prod.ps4;
      } else if (prod.ps5 !== "") {
        precio = prod.ps5;
      } else if (prod.secundario !== "") {
        precio = prod.secundario;
      }
      priceTag.textContent = precio ? `$${precio}` : 'Sin stock';
    }

    if (selectPlataforma) selectPlataforma.addEventListener('change', actualizarPrecio);
    selectTipo.addEventListener('change', actualizarPrecio);

    // Botón añadir al carrito
    const btnCarrito = document.querySelector(`.btn-carrito-ps[data-idx="${idx}"]`);
    if (btnCarrito) {
      btnCarrito.addEventListener('click', () => {
        const plat = selectPlataforma ? selectPlataforma.value : '';
        const tipo = selectTipo.value;
        let precio = '';
        if (tipo === 'secundario' && prod.secundario !== "") {
          precio = prod.secundario;
        } else if (plat === 'ps4' && prod.ps4 !== "") {
          precio = prod.ps4;
        } else if (plat === 'ps5' && prod.ps5 !== "") {
          precio = prod.ps5;
        } else if (prod.ps4 !== "") {
          precio = prod.ps4;
        } else if (prod.ps5 !== "") {
          precio = prod.ps5;
        } else if (prod.secundario !== "") {
          precio = prod.secundario;
        }
        if (!precio) {
          alert('Sin stock para esta combinación.');
          return;
        }
        carrito.push({
          producto: `${prod.nombre} (${plat.toUpperCase()} - ${tipo})`,
          precio: `$${precio}`
        });
        actualizarCarrito();
      });
    }
  });
}

// Ejecutar al cargar la página
if (document.getElementById('playstation-products')) {
  cargarPlayStation();
}

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
  // Reemplaza tu número real de WhatsApp
  const url = `https://wa.me/123456789?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
});

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
// BARRA DE BÚSQUEDA GLOBAL (TODOS LOS PRODUCTOS DE LA PÁGINA)
// ====================
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

function filtrarProductos() {
  const query = searchInput.value.trim().toLowerCase();
  // Selecciona todos los productos visibles en la página
  document.querySelectorAll(".product-card").forEach(card => {
    const nombre = card.querySelector("h4")?.innerText.toLowerCase() || "";
    card.style.display = nombre.includes(query) ? "" : "none";
  });
}
searchInput.addEventListener("input", filtrarProductos);
searchBtn.addEventListener("click", filtrarProductos);
