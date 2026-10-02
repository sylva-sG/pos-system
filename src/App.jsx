import { useEffect, useMemo, useReducer, useState } from "react";
import { getAllProducts } from "./api/products";
import { cartReducer } from "./cart/cartReducer";
import { formatKsh } from "./utils/formatPrice";
import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import Cart from "./components/Cart";

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
      .then((data) =>
        setProducts(
          data.filter((product) =>
            ["laptops", "mobile-accessories"].includes(String(product.category).toLowerCase())
          )
        )
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
  };

  const completeSale = (total, itemCount) => {
    if (itemCount <= 0) return;

    setSale({ total, itemCount });
    dispatch({ type: "CLEAR" });
  };

  return (
    <div className="pos-app">
      <header className="app-header">
        <a className="brand-lockup" href="/" aria-label="TechPoint home">
          <span className="brand-mark" aria-hidden="true">T</span>
          <span className="brand-copy">
            <span className="brand-name">TechPoint</span>
            <span className="brand-caption">Point of sale</span>
          </span>
        </a>
        <div className="terminal-status">
          <span className="status-indicator" aria-hidden="true" />
          <span>Sales terminal</span>
        </div>
      </header>

      <main className="main-content">
        <section className="catalogue" aria-labelledby="catalogue-title">
          <div className="catalogue-heading">
            <div>
              <p className="section-kicker">STORE INVENTORY</p>
              <h1 id="catalogue-title">Browse products</h1>
              <p className="section-description">
                Electronics and accessories for every setup.
              </p>
            </div>
            {!loading && !error && (
              <p className="product-count">
                <strong>{products.length}</strong> products
              </p>
            )}
          </div>

          {sale && (
            <div className="sale-confirmation" role="status">
              <p>
                Sale completed! {sale.itemCount} item(s), total <strong>{formatKsh(sale.total)}</strong>.
              </p>
              <button onClick={() => setSale(null)}>New sale</button>
            </div>
          )}

          <div className="catalogue-controls">
            <SearchBar value={search} onChange={setSearch} />
            <CategoryFilter
              categories={categories}
              selected={category}
              onChange={setCategory}
            />
          </div>

          {loading ? (
            <div className="catalogue-message" role="status" aria-live="polite">
              <span className="loading-indicator" aria-hidden="true" />
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="catalogue-message catalogue-message--error" role="alert">
              <h2>Products couldn’t be loaded</h2>
              <p>{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="catalogue-message">
              <h2>No products available</h2>
              <p>There are no matching products to display right now.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="catalogue-message">
              <h2>No products match your search</h2>
              <button className="clear-filters-button" onClick={clearFilters}>Clear filters</button>
            </div>
          ) : (
            <div className="catalogue-layout">
              <div className="catalogue-panel">
                <p className="catalogue-summary">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
                <ProductList
                  products={filteredProducts}
                  cart={cart}
                  onAddToCart={(product) => dispatch({ type: "ADD", product })}
                />
              </div>

              <Cart
                items={cart}
                onIncrement={(id) => dispatch({ type: "INCREMENT", id })}
                onDecrement={(id) => dispatch({ type: "DECREMENT", id })}
                onRemove={(id) => dispatch({ type: "REMOVE", id })}
                onClear={() => dispatch({ type: "CLEAR" })}
                onCheckout={completeSale}
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;