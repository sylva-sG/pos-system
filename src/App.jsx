import { useEffect, useState } from "react";
import { getProducts } from "./api/products";
import ProductList from "./components/ProductList";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return <h1>Error: {error}</h1>;
  }

  return (
    <div>
      <h1>TechPoint POS</h1>

      <p>Products available: {products.length}</p>

      <ProductList products={products} />
    </div>
  );
}

export default App;