// --------- DOM  ---------

const productsGrid = document.getElementById("productsGrid");
const categoryList = document.getElementById("categoryList");
const loadingSpinner = document.getElementById("loading-spinner");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");


const cartItemsMobile = document.getElementById("cartItemsMobile");
const cartTotalMobile = document.getElementById("cartTotalMobile");


const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

let cart = [];
const BASE_URL = "https://openapi.programming-hero.com/api";


// ---------- Data Fetching ----

async function fetchData(type, id = null) {
  let url;
  if (type === "categories") {
    url = `${BASE_URL}/categories`;
  } else if (type === "plants") {
    url = id === "all" ? `${BASE_URL}/plants` : `${BASE_URL}/category/${id}`;
  } else if (type === "plantDetail") {
    url = `${BASE_URL}/plant/${id}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (type === "categories") {
      return data.categories;
    } else if (type === "plants") {
  return data.plants;
} else if (type === "plantDetail") {
  return data.plants;  
}
  } catch (err) {
    console.error("Error fetching data:", err);
    return null;
  }
}


// --- Render Functions --------------

async function loadCategories() {
  let categories = await fetchData("categories");
  if (categories) {
    categories.unshift({
      id: "all",
      category_name: "All Trees",
      small_description: "All available trees",
    });
    categoryList.innerHTML = "";
    categories.forEach((cat) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.className = `category-filter category-item block px-4 py-2 text-base font-normal transition-colors hover:bg-[#CFF0DC] hover:rounded ${
        cat.id === "all" ? "bg-[#15803D] text-geDeep rounded" : ""
      } whitespace-nowrap`;
      a.textContent = cat.category_name;
      a.dataset.id = cat.id;
      li.appendChild(a);
      categoryList.appendChild(li);
    });
  }
  loadPlants("all");
}

async function loadPlants(categoryId) {
  loadingSpinner.classList.remove("hidden");
  loadingSpinner.classList.add("flex");
  const plants = await fetchData("plants", categoryId);
  loadingSpinner.classList.add("hidden");
  loadingSpinner.classList.remove("flex");
  if (plants) {
    renderProducts(plants);
  }
}

async function loadPlantDetails(plantId) {
  return await fetchData("plantDetail", plantId);
}


function renderProducts(list) {
  productsGrid.innerHTML = "";
  if (!list || list.length === 0) {
    productsGrid.innerHTML =
      "<p class='text-red-500 text-center col-span-full'>No trees found in this category.</p>";
    return;
  }


  list.forEach((product) => {
    const card = document.createElement("div");
    card.className =
      "fade-up bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden p-2";

    
    const imageTag = product.image
      ? `<img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover" />`
      : "";

    card.innerHTML = `
      ${imageTag}
      <div class="px-5 pt-5 pb-2">
        <h4 class="text-sm font-semibold text-[#1F2937] cursor-pointer" data-id="${product.id}">${product.name}</h4>
        <p class="text-[#1F2937] mt-1 text-xs">${product.description}</p>
        <div class="flex items-center justify-between mt-1">
          <span class="px-2 py-1 rounded-full text-sm font-medium bg-emerald-50 text-[#15803D]">${product.category}</span> 
          <span class="text-[#1F2937] font-semibold">৳${product.price}</span>
        </div>
        <button class="w-full mt-4 rounded-full bg-[#15803D] text-white font-semibold py-2 add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>`;

    productsGrid.appendChild(card);
  });

  
  productsGrid.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      addToCart(e.currentTarget.dataset.id)
    );
  });

  productsGrid.querySelectorAll("h4").forEach((name) => {
    name.addEventListener("click", (e) =>
      showModal(e.currentTarget.dataset.id)
    );
  });

  setupFadeUp();
}


function renderCart() {

  const targets = [
    { items: cartItems,       total: cartTotal },
    { items: cartItemsMobile, total: cartTotalMobile },
  ];

  let total = 0;

  
  targets.forEach((t) => {
    if (!t?.items || !t?.total) return;
    t.items.innerHTML = ""; 
  });


  if (cart.length === 0) {
    targets.forEach((t) => {
      if (!t?.total) return;
      t.total.textContent = "৳0";
      const tw = t.total.closest(".border-t");
      if (tw) tw.style.display = "none";
    });
    return;
  }


  cart.forEach((item) => {
    total += item.price * item.quantity;
    targets.forEach((t) => {
      if (!t?.items) return;
      const row = document.createElement("div");
      row.className = "flex items-center justify-between p-2 mb-2 rounded-md bg-emerald-50";
      row.innerHTML = `
        <div class="flex-1">
          <span class="font-semibold text-sm">${item.name}</span>
          <span class="text-gray-600 text-xs block">৳${item.price} × ${item.quantity}</span>
        </div>
        <button class="remove-from-cart text-gray-500 hover:text-red-600 transition-colors ml-2 text-sm" data-id="${item.id}">&times;</button>`;
      t.items.appendChild(row);
    });
  });


  targets.forEach((t) => {
    if (!t?.total) return;
    t.total.textContent = `৳${total}`;
    const tw = t.total.closest(".border-t");
    if (tw) tw.style.display = "";
  });


  [cartItems, cartItemsMobile].forEach((container) => {
    if (!container) return;
    container.querySelectorAll(".remove-from-cart").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        removeFromCart(e.currentTarget.dataset.id)
      );
    });
  });
}


// ----------- Cart Actions ------------

async function addToCart(plantId) {
  const plant = await loadPlantDetails(plantId);
  if (!plant) return;

  const existing = cart.find((i) => i.id === plant.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: plant.id,
      name: plant.name,
      price: plant.price,
      quantity: 1,
    });
  }
  renderCart();



  alert(`${plant.name} has been added to the cart`);
}


function removeFromCart(plantId) {
  const idx = cart.findIndex((item) => item.id == plantId);
  if (idx !== -1) {
    if (cart[idx].quantity > 1) {
      cart[idx].quantity -= 1;
    } else {
      cart.splice(idx, 1);
    }
    renderCart();
  }
}

// ------------ Event Handlers --------------

function setupCategoryFilters() {
  categoryList.addEventListener("click", (e) => {
    if (e.target.matches(".category-filter")) {
      e.preventDefault();
      const filters = categoryList.querySelectorAll(".category-filter");
      filters.forEach((x) =>
        x.classList.remove("bg-[#15803D]", "text-geDeep", "rounded")
      );
      e.target.classList.add("bg-[#15803D]", "text-geDeep", "rounded");
      const categoryId = e.target.dataset.id;
      loadPlants(categoryId);
    }
  });
}


async function showModal(plantId) {
  const plant = await loadPlantDetails(plantId);
  if (plant) {
    const imageTag = plant.image
      ? `<img src="${plant.image}" alt="${plant.name}" class="w-full h-48 object-cover mb-4 rounded" />`
      : ""; 

    modalContent.innerHTML = `
      <div class="p-2 rounded-lg">
        ${imageTag}
        <h3 class="text-lg font-semibold text-gray-800">${plant.name}</h3>
        <p class="text-gray-600 text-sm mt-2">${plant.description}</p>
        <div class="flex items-center justify-between mt-4">
          <span class="px-2 py-1 bg-emerald-50 text-[#15803D] text-sm font-medium rounded-full">
  ${plant.category}
</span>
          <span class="text-[#1F2937] font-semibold">৳${plant.price}</span>
        </div>
        <button class="w-full mt-4 rounded-full bg-[#15803D] text-white font-semibold py-2 add-to-cart" data-id="${plant.id}">Add to Cart</button>
      </div>
    `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    modalContent
      .querySelector(".add-to-cart")
      .addEventListener("click", (e) =>
        addToCart(e.currentTarget.dataset.id)
      );
  }
}


function closeModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function setupFormSubmission() {
  const form = document.getElementById("donationForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const trees = form.querySelector("select").value;
    if (name && email && trees) {
      alert(
        `Thank you, ${name}! Your donation for ${trees} tree(s) has been received. We'll send confirmation to ${email}.`
      );
      form.reset();
    }
  });
}



function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setupFadeUp() {
  const els = document.querySelectorAll(".fade-up");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    },
    { threshold: 0.2 }
  );
  els.forEach((el) => io.observe(el));
}

function setupMobileMenu() {
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
}


document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  loadCategories();
  renderCart(); 
  setupCategoryFilters();
  setupFormSubmission();
  setupFadeUp();
});
