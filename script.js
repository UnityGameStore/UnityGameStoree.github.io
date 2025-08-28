// ====================
// CARRITO POPUP
// ====================
const cartBtn = document.getElementById("cart-btn");
const cartPopup = document.getElementById("cart-popup");

cartBtn.addEventListener("click", () => {
  if (cartPopup.style.display === "block") {
    cartPopup.style.display = "none";
  } else {
    cartPopup.style.display = "block";
  }
});

// ====================
// AGREGAR AL CARRITO
// ====================
const cartItems = document.getElementById("cart-items");
let carrito = [];

document.querySelectorAll(".product-card button").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const producto = btn.parentElement.querySelector("h4").innerText;
    const precio = btn.parentElement.querySelector("p").innerText;

    carrito.push({ producto, precio });
    actualizarCarrito();
  });
});

function actualizarCarrito() {
  cartItems.innerHTML = "";
  carrito.forEach((item, i) => {
    const li = document.createElement("li");
    li.textContent = `${item.producto} - ${item.precio}`;
    cartItems.appendChild(li);
  });
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

  // Reemplaza tu número de WhatsApp
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

setInterval(() => {
  showSlide(1);
}, 5000);

// ====================
// BARRA DE BÚSQUEDA DE PRODUCTOS ESTÁTICOS
// ====================
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const productCards = document.querySelectorAll(".product-card");

function filtrarProductos() {
  const query = searchInput.value.trim().toLowerCase();
  productCards.forEach(card => {
    const nombre = card.querySelector("h4").innerText.toLowerCase();
    if (nombre.includes(query)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

searchInput.addEventListener("input", filtrarProductos);
searchBtn.addEventListener("click", filtrarProductos);

// ==========================
// CARGAR PRODUCTOS PLAYSTATION DESDE CSV
// ==========================
function cargarPlayStation() {
  fetch('data/playstation.csv')
    .then(res => res.text())
    .then(data => {
      // Parsear CSV a objetos
      const lines = data.trim().split('\n');
      const headers = lines[0].split(',');
      const productos = lines.slice(1).map(line => {
        // Manejar comillas en nombres con comas
        let values = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          if (line[i] === '"' && (i === 0 || line[i-1] !== '\\')) {
            inQuotes = !inQuotes;
            continue;
          }
          if (line[i] === ',' && !inQuotes) {
            values.push(current);
            current = '';
          } else {
            current += line[i];
          }
        }
        values.push(current);

        let obj = {};
        headers.forEach((h, i) => obj[h.trim() || (i===0?'nombre':'')] = (values[i]||'').trim());
        return obj;
      });
      renderPlaystationProductos(productos);
    });
}

function renderPlaystationProductos(productos) {
  const container = document.getElementById('playstation-products');
  container.innerHTML = '';
  productos.forEach((prod, idx) => {
    // Validación: solo juegos con nombre (evita líneas vacías)
    if (!prod.nombre) return;

    // Opciones de plataforma y tipo
    const tienePS4 = prod.ps4 && prod.ps4 !== '';
    const tienePS5 = prod.ps5 && prod.ps5 !== '';
    const tieneSecundario = prod.secundario && prod.secundario !== '';

    // Si no hay ninguna versión disponible, no mostrar
    if (!tienePS4 && !tienePS5 && !tieneSecundario) return;

    const prodId = `ps-prod-${idx}`;
    // Menú de plataforma dinámico
    let plataformaOptions = '';
    if (tienePS4) plataformaOptions += `<option value="ps4">PS4</option>`;
    if (tienePS5) plataformaOptions += `<option value="ps5">PS5</option>`;

    // Menú de tipo dinámico
    let tipoOptions = '<option value="principal">Principal</option>';
    if (tieneSecundario) tipoOptions += `<option value="secundario">Secundario</option>`;

    // Determinar precio inicial
    let precioInicial = '';
    if (tienePS4) {
      precioInicial = prod.ps4;
    } else if (tienePS5) {
      precioInicial = prod.ps5;
    } else if (tieneSecundario) {
      precioInicial = prod.secundario;
    }

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

    if (!selectPlataforma || !selectTipo || !priceTag) return;

    function actualizarPrecio() {
      const plat = selectPlataforma ? selectPlataforma.value : '';
      const tipo = selectTipo.value;
      let precio = '';
      if (tipo === 'secundario' && prod.secundario) {
        precio = prod.secundario;
      } else if (plat === 'ps4' && prod.ps4) {
        precio = prod.ps4;
      } else if (plat === 'ps5' && prod.ps5) {
        precio = prod.ps5;
      } else if (prod.ps4) {
        precio = prod.ps4;
      } else if (prod.ps5) {
        precio = prod.ps5;
      } else if (prod.secundario) {
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
        if (tipo === 'secundario' && prod.secundario) {
          precio = prod.secundario;
        } else if (plat === 'ps4' && prod.ps4) {
          precio = prod.ps4;
        } else if (plat === 'ps5' && prod.ps5) {
          precio = prod.ps5;
        } else if (prod.ps4) {
          precio = prod.ps4;
        } else if (prod.ps5) {
          precio = prod.ps5;
        } else if (prod.secundario) {
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

// Ejecutar al cargar la página (cuando existe el bloque)
if (document.getElementById('playstation-products')) {
  cargarPlayStation();
}