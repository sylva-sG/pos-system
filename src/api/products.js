const API_URL = "https://dummyjson.com/products";
const ELECTRONICS_CATEGORIES = new Set(["laptops", "mobile-accessories"]);

export async function getProducts() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();

  return data.products.filter((product) =>
    ELECTRONICS_CATEGORIES.has(String(product.category).toLowerCase())
  );
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
}

export async function getAllProducts() {
  const response = await fetch(`${API_URL}?limit=0`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();
  return data.products.filter((product) => product.category?.toLowerCase() === "electronics");
}