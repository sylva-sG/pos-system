import { useEffect, useMemo, useReducer, useState } from "react";

import { getAllProducts } from "./api/products";
import { cartReducer } from "./cart/cartReducer";
import { formatKsh, toKsh } from "./utils/formatPrice";

import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import Cart from "./components/Cart";

import "./App.css";
import "./styles/products.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [cart, dispatch] = useReducer(cartReducer, []);
  const [sale, setSale] = useState(null);

  useEffect(() => {
    getAllProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((p) => {
      const matchesCategory =
        category === "all" || p.category === category;

      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
  };

  const completeSale = (total, itemCount) => {
    if (itemCount <= 0) return;

    setSale({
      total,
      itemCount,
      items: cart,
    });

    dispatch({ type: "CLEAR" });
  };

  if (loading) {
    return <h1>Loading products...</h1>;
  }

  if (error) {
    return <h1>Error: {error}</h1>;
  }

  return (
    <div className="app">
      <h1>TechPoint POS</h1>

      {sale && (
        <div className="sale-confirmation" role="status">
          <h2>TECHPOINT — SIMULATED SALE</h2>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {sale.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.quantity}</td>
                  <td>{formatKsh(toKsh(item.price))}</td>
                  <td>
                    {formatKsh(
                      toKsh(item.price) * item.quantity
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>TOTAL: {formatKsh(sale.total)}</h3>

          <p>Status: Simulated sale completed</p>

          <button onClick={() => setSale(null)}>
            New sale
          </button>
        </div>
      )}

      <div className="pos-layout">
        <main className="catalogue">
          <div className="filters">
            <SearchBar
              value={search}
              onChange={setSearch}
            />

            <CategoryFilter
              categories={categories}
              selected={category}
              onChange={setCategory}
            />
          </div>

          <p>
            Showing {filteredProducts.length} of{" "}
            {products.length} products
          </p>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <p>No products match your search.</p>

              <button onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          ) : (
            <ProductList
              products={filteredProducts}
              cart={cart}
              onAddToCart={(product) =>
                dispatch({
                  type: "ADD",
                  product,
                })
              }
            />
          )}
        </main>

        <Cart
          items={cart}
          onIncrement={(id) =>
            dispatch({
              type: "INCREMENT",
              id,
            })
          }
          onDecrement={(id) =>
            dispatch({
              type: "DECREMENT",
              id,
            })
          }
          onRemove={(id) =>
            dispatch({
              type: "REMOVE",
              id,
            })
          }
          onClear={() =>
            dispatch({
              type: "CLEAR",
            })
          }
          onCheckout={completeSale}
        />
      </div>
    </div>
  );
}

export default App;