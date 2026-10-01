import { useEffect, useState } from "react";
import { getProducts } from "./api/products";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import "./styles/products.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
    <div className="pos-app">

      {!selectedProduct ? (

        <div className="products-page">

          <h1>Products</h1>

          <ProductList
            products={products}
            onProductSelect={setSelectedProduct}
          />

        </div>

      ) : (

        <ProductDetails
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
        />

      )}

    </div>
  );
}

export default App;