import { useEffect, useState } from "react";
import { getProducts } from "./api/products";
import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h1>Loading products...</h1>;
  }

  if (error) {
    const categories = [...new Set(products.map((p) => p.category))];

const filteredProducts = products.filter((product) => {
  const matchesSearch = product.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
  const matchesCategory =
    selectedCategory === "all" || product.category === selectedCategory;
  return matchesSearch && matchesCategory;
   });
    return <h1>Error: {error}</h1>;
  }

  return (
   <div>
    <h1>TechPoint POS</h1>

    <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
    <CategoryFilter
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
    />

    <p>Products available: {filteredProducts.length}</p>

    <ProductList products={filteredProducts} />
  </div>
);
}

export default App;