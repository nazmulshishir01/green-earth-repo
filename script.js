// ------------------ DOM  ------------------

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


// ------------------ Data Fetching ------------------

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
    } else if (type === "plants" || type === "plantDetail") {
      return data.plants;
    }
  } catch (err) {
    console.error("Error fetching data:", err);
    return null;
  }
}



// ------------------ Render Functions ------------------

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
    { items: cartItems, total: cartTotal },
    { items: cartItemsMobile, total: cartTotalMobile },
  ];

  let total = 0;
  targets.forEach((t) => {
    if (!t.items || !t.total) return;
    t.items.innerHTML = "";
  });

  if (cart.length === 0) {
    targets.forEach((t) => {
      if (!t || !t.items || !t.total) return;
      
      if (t.items === cartItems) {
        t.items.innerHTML = `<p class="text-gray-500 text-center">Your cart is empty.</p>`;
      }
      t.total.textContent = "৳0";
      const tw = t.total.closest(".border-t");
      if (tw) tw.style.display = "none";
    });
    return;
  }

  cart.forEach((item) => {
    total += item.price * item.quantity;
    targets.forEach((t) => {
      if (!t || !t.items) return;
      const row = document.createElement("div");
      row.className =
        "flex items-center justify-between p-2 mb-2 rounded-md bg-emerald-50";
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
    if (!t || !t.total) return;
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
