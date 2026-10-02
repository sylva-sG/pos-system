import { useEffect, useReducer, useState } from "react";
import { getAllProducts } from "./api/products";
import { cartReducer } from "./cart/cartReducer";
import { formatKsh } from "./utils/formatPrice";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [sale, setSale] = useState(null);

  useEffect(() => {
    getAllProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const completeSale = (total, itemCount) => {
    setSale({ total, itemCount });
    dispatch({ type: "CLEAR" });
  };

  if (loading) return <h1>Loading products...</h1>;
  if (error) return <h1>Error: {error}</h1>;

  return (
    <div className="app">
      <h1>TechPoint POS</h1>

      {sale && (
        <div className="sale-confirmation" role="status">
          <p>
            Sale completed! {sale.itemCount} item(s), total{" "}
            <strong>{formatKsh(sale.total)}</strong>.
          </p>
          <button onClick={() => setSale(null)}>New sale</button>
        </div>
      )}

      <div className="pos-layout">
        <main className="catalogue">
          <p>Products available: {products.length}</p>

          <ProductList
            products={products}
            cart={cart}
            onAddToCart={(product) => dispatch({ type: "ADD", product })}
          />
        </main>

        <Cart
          items={cart}
          onIncrement={(id) => dispatch({ type: "INCREMENT", id })}
          onDecrement={(id) => dispatch({ type: "DECREMENT", id })}
          onRemove={(id) => dispatch({ type: "REMOVE", id })}
          onClear={() => dispatch({ type: "CLEAR" })}
          onCheckout={completeSale}
        />
      </div>
    </div>
  );
}

export default App;