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