import {
  useEffect,
  useMemo,
  useReducer,
  useState,
  useRef,
} from "react";

import { getProducts } from "./api/products";
import { cartReducer } from "./cart/cartReducer";
import { formatKsh } from "./utils/formatPrice";

import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
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

  const [sessionSales, setSessionSales] = useState([]);
  const receiptRef = useRef(null);
  const [view, setView] = useState("home");
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const productDetailsRef = useRef(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () =>
      [...new Set(products.map((product) => product.category))].sort(),
    [products]
  );

  const featuredProducts = useMemo(() => {
    const productsByCategory = new Map();

    products.forEach((product) => {
      const categoryProducts =
        productsByCategory.get(product.category) ?? [];

      if (categoryProducts.length < 2) {
        categoryProducts.push(product);
      }

      productsByCategory.set(product.category, categoryProducts);
    });

    return [...productsByCategory.values()].flat();
  }, [products]);

  useEffect(() => {
    if (
      featuredProducts.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setFeaturedIndex(
        (index) => (index + 1) % featuredProducts.length
      );
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [featuredProducts.length]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "all" ||
        product.category === category;

      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const quantityInCart =
        cart.find((item) => item.id === product.id)?.quantity ?? 0;

      const matchesStock =
        view !== "low-stock" ||
        (product.stock > 0 &&
          product.stock - quantityInCart <= 10);

      return (
        matchesCategory &&
        matchesSearch &&
        matchesStock
      );
    });
  }, [products, search, category, view, cart]);

  const lowStockCount = products.filter((product) => {
    const quantityInCart =
      cart.find((item) => item.id === product.id)?.quantity ?? 0;

    return (
      product.stock > 0 &&
      product.stock - quantityInCart <= 10
    );
  }).length;

  const featuredProduct =
    featuredProducts[featuredIndex];

  const latestSale =
    sessionSales[sessionSales.length - 1];

  const moveFeatured = (direction) => {
    setFeaturedIndex(
      (index) =>
        (index +
          direction +
          featuredProducts.length) %
        featuredProducts.length
    );
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setView("products");
  };

  const navigateTo = (nextView) => {
    setSearch("");
    setCategory("all");
    setView(nextView);
    setSelectedProduct(null);
  };

  const completeSale = () => {
  if (cart.length === 0) {
    return;
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const completedSale = {
    items: cart.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    })),
    total,
    itemCount: cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    ),
    completedAt: new Date().toISOString(),
  };

  setSale(completedSale);
  setSessionSales((sales) => [
    ...sales,
    completedSale,
  ]);

  dispatch({ type: "CLEAR" });

  setTimeout(() => {
    receiptRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
};

  const handleViewDetails = (product) => {
    setSelectedProduct(product);

    setTimeout(() => {
      productDetailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div className="pos-app">
      <header className="app-header">
        <button
          className="brand-lockup"
          type="button"
          onClick={() => navigateTo("home")}
          aria-label="TechPoint home"
        >
          <span
            className="brand-mark"
            aria-hidden="true"
          >
            T
          </span>

          <span className="brand-copy">
            <span className="brand-name">
              TechPoint
            </span>

            <span className="brand-caption">
              Point of sale
            </span>
          </span>
        </button>

        <nav
          className="app-nav"
          aria-label="Main navigation"
        >
          <button
            className={`app-nav-button${
              view === "home" ? " is-active" : ""
            }`}
            type="button"
            aria-current={
              view === "home" ? "page" : undefined
            }
            onClick={() => navigateTo("home")}
          >
            Home
          </button>

          <button
            className={`app-nav-button${
              view === "categories" ? " is-active" : ""
            }`}
            type="button"
            aria-current={
              view === "categories"
                ? "page"
                : undefined
            }
            onClick={() => navigateTo("categories")}
          >
            Categories
          </button>

          <button
            className={`app-nav-button${
              view === "products" ? " is-active" : ""
            }`}
            type="button"
            aria-current={
              view === "products"
                ? "page"
                : undefined
            }
            onClick={() => navigateTo("products")}
          >
            Products
          </button>

          <button
            className={`app-nav-button${
              view === "low-stock" ? " is-active" : ""
            }`}
            type="button"
            aria-current={
              view === "low-stock"
                ? "page"
                : undefined
            }
            onClick={() =>
              navigateTo("low-stock")
            }
          >
            Low stock
          </button>
        </nav>

        <div className="terminal-status">
          <span
            className="status-indicator"
            aria-hidden="true"
          />

          <span>
            {view === "home"
              ? "Terminal ready"
              : "Sales terminal"}
          </span>
        </div>
      </header>

      {view === "home" ? (
        <main className="home-content">
          <section
            className="welcome-hero"
            aria-labelledby="welcome-title"
          >
            <div className="welcome-copy">
              <p className="welcome-kicker">
                TECHPOINT · HOME
              </p>

              <h1 id="welcome-title">
                Welcome back.
                <br />
                Let’s get selling.
              </h1>

              <p className="welcome-description">
                Your counter is ready. Pick up where
                you left off and make the next sale.
              </p>

              <button
                className="start-sale-button"
                type="button"
                onClick={() =>
                  navigateTo("products")
                }
              >
                Start a sale{" "}
                <span aria-hidden="true">
                  →
                </span>
              </button>

              <p className="welcome-hint">
                Your product catalogue is ready
                whenever you are.
              </p>
            </div>

            <div
              className="welcome-feature"
              role="region"
              aria-label="Featured products"
              aria-roledescription="carousel"
            >
              {featuredProduct ? (
                <>
                  <span className="feature-label">
                    IN THE SHOP
                  </span>

                  {featuredProducts.length > 1 && (
                    <div className="feature-controls">
                      <span aria-hidden="true">
                        {String(
                          featuredIndex + 1
                        ).padStart(2, "0")}{" "}
                        /{" "}
                        {String(
                          featuredProducts.length
                        ).padStart(2, "0")}
                      </span>

                      <button
                        className="feature-control-button"
                        type="button"
                        aria-label="Previous featured product"
                        onClick={() =>
                          moveFeatured(-1)
                        }
                      >
                        ←
                      </button>

                      <button
                        className="feature-control-button"
                        type="button"
                        aria-label="Next featured product"
                        onClick={() =>
                          moveFeatured(1)
                        }
                      >
                        →
                      </button>
                    </div>
                  )}

                  <img
                    key={featuredProduct.id}
                    src={featuredProduct.thumbnail}
                    alt={featuredProduct.title}
                  />

                  <div className="feature-product-copy">
                    <span>
                      {featuredProduct.category.replaceAll(
                        "-",
                        " "
                      )}
                    </span>

                    <strong>
                      {featuredProduct.title}
                    </strong>

                    <span className="feature-product-price">
                      {formatKsh(
                        featuredProduct.price
                      )}
                    </span>
                  </div>
                </>
              ) : (
                <p className="feature-placeholder">
                  {loading
                    ? "Loading your inventory…"
                    : "Your featured product will appear here."}
                </p>
              )}
            </div>
          </section>

          <section
            className="home-overview"
            aria-labelledby="overview-title"
          >
            <div className="overview-heading">
              <div>
                <p className="section-kicker">
                  AT A GLANCE
                </p>

                <h2 id="overview-title">
                  Live at your counter
                </h2>
              </div>

              {error && (
                <p
                  className="overview-error"
                  role="status"
                >
                  Inventory unavailable
                </p>
              )}
            </div>

            <div className="overview-stats">
              <button
                className="overview-stat overview-stat-button"
                type="button"
                aria-label={`View all ${products.length} products`}
                onClick={() =>
                  navigateTo("products")
                }
              >
                <span>Products listed</span>

                <strong>
                  {loading
                    ? "—"
                    : products.length}
                </strong>
              </button>

              <button
                className="overview-stat overview-stat-button"
                type="button"
                aria-label={`Browse ${categories.length} product categories`}
                onClick={() =>
                  navigateTo("categories")
                }
              >
                <span>
                  Product categories
                </span>

                <strong>
                  {loading
                    ? "—"
                    : categories.length}
                </strong>
              </button>

              <button
                className="overview-stat overview-stat-button"
                type="button"
                aria-label={`View ${lowStockCount} low-stock products`}
                onClick={() =>
                  navigateTo("low-stock")
                }
              >
                <span>Running low</span>

                <strong>
                  {loading
                    ? "—"
                    : lowStockCount}
                </strong>
              </button>

              <div className="overview-stat">
                <span>
                  Sales this session
                </span>

                <strong>
                  {sessionSales.length}
                </strong>
              </div>
            </div>
          </section>

          <section
            className="recent-activity"
            aria-labelledby="activity-title"
          >
            <div>
              <p className="section-kicker">
                RECENT ACTIVITY
              </p>

              <h2 id="activity-title">
                Latest sale
              </h2>
            </div>

            {latestSale ? (
              <p className="recent-activity-detail">
                <span>
                  {latestSale.itemCount} item
                  {latestSale.itemCount === 1
                    ? ""
                    : "s"}{" "}
                  sold for{" "}
                  <strong>
                    {formatKsh(
                      latestSale.total
                    )}
                  </strong>
                </span>

                <time
                  dateTime={
                    latestSale.completedAt
                  }
                >
                  {new Intl.DateTimeFormat(
                    undefined,
                    {
                      hour: "numeric",
                      minute: "2-digit",
                    }
                  ).format(
                    new Date(
                      latestSale.completedAt
                    )
                  )}
                </time>
              </p>
            ) : (
              <p className="recent-activity-empty">
                No completed sales this session
              </p>
            )}
          </section>
        </main>
      ) : view === "categories" ? (
        <main className="main-content">
          <section
            className="category-directory"
            aria-labelledby="categories-title"
          >
            <div className="catalogue-heading">
              <div>
                <p className="section-kicker">
                  STORE INVENTORY
                </p>

                <h1 id="categories-title">
                  Product categories
                </h1>

                <p className="section-description">
                  Choose a category to browse its
                  products.
                </p>
              </div>
            </div>

            {loading ? (
              <div
                className="catalogue-message"
                role="status"
                aria-live="polite"
              >
                <span
                  className="loading-indicator"
                  aria-hidden="true"
                />

                <p>
                  Loading categories...
                </p>
              </div>
            ) : error ? (
              <div
                className="catalogue-message catalogue-message--error"
                role="alert"
              >
                <h2>
                  Categories couldn’t be loaded
                </h2>

                <p>{error}</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="catalogue-message">
                <h2>
                  No categories available
                </h2>

                <p>
                  There are no product categories
                  to display right now.
                </p>
              </div>
            ) : (
              <ul className="category-list">
                {categories.map(
                  (categoryName) => {
                    const productCount =
                      products.filter(
                        (product) =>
                          product.category ===
                          categoryName
                      ).length;

                    const categoryLabel =
                      categoryName
                        .split("-")
                        .map(
                          (word) =>
                            word
                              .charAt(0)
                              .toUpperCase() +
                            word.slice(1)
                        )
                        .join(" ");

                    return (
                      <li
                        key={categoryName}
                      >
                        <button
                          className="category-list-button"
                          type="button"
                          onClick={() => {
                            setCategory(
                              categoryName
                            );
                            setView("products");
                          }}
                        >
                          <span className="category-list-copy">
                            <strong>
                              {categoryLabel}
                            </strong>

                            <span>
                              {productCount} products
                            </span>
                          </span>

                          <span
                            className="category-list-arrow"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </button>
                      </li>
                    );
                  }
                )}
              </ul>
            )}
          </section>
        </main>
      ) : (
        <main className="main-content">
          <section
            className="catalogue"
            aria-labelledby="catalogue-title"
          >
            <div className="catalogue-heading">
              <div>
                <p className="section-kicker">
                  STORE INVENTORY
                </p>

                <h1 id="catalogue-title">
                  {view === "low-stock"
                    ? "Low-stock products"
                    : "Browse products"}
                </h1>

                <p className="section-description">
                  {view === "low-stock"
                    ? "Products with 10 or fewer units in stock."
                    : "Electronics and accessories for every setup."}
                </p>
              </div>

              {!loading && !error && (
                <p className="product-count">
                  <strong>
                    {products.length}
                  </strong>{" "}
                  products
                </p>
              )}
            </div>

          {sale && (
  <div
    className="sale-confirmation"
    ref={receiptRef}
    role="status"
  >
    <h2>Sale Completed</h2>

    <div className="receipt">
      <h3>TECHPOINT RECEIPT</h3>

      <p>
        <strong>Date:</strong>{" "}
        {new Date(sale.completedAt).toLocaleString()}
      </p>

      <hr />

      {sale.items.map((item) => (
        <div key={item.id} className="receipt-item">
          <div>
            <strong>{item.title}</strong>
            <p>
              {item.quantity} × {formatKsh(item.price)}
            </p>
          </div>

          <strong>
            {formatKsh(item.price * item.quantity)}
          </strong>
        </div>
      ))}

      <hr />

      <div className="receipt-total">
        <strong>TOTAL</strong>
        <strong>{formatKsh(sale.total)}</strong>
      </div>
    </div>

    <p className="sale-success-message">
      ✓ Sale completed successfully.
    </p>

    <button onClick={() => setSale(null)}>
      New Sale
    </button>
  </div>
)}
            <div className="catalogue-controls">
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

            {loading ? (
              <div
                className="catalogue-message"
                role="status"
                aria-live="polite"
              >
                <span
                  className="loading-indicator"
                  aria-hidden="true"
                />

                <p>
                  Loading products...
                </p>
              </div>
            ) : error ? (
              <div
                className="catalogue-message catalogue-message--error"
                role="alert"
              >
                <h2>
                  Products couldn’t be loaded
                </h2>

                <p>{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="catalogue-message">
                <h2>
                  No products available
                </h2>

                <p>
                  There are no matching products
                  to display right now.
                </p>
              </div>
            ) : filteredProducts.length ===
              0 ? (
              <div className="catalogue-message">
                <h2>
                  {view === "low-stock"
                    ? "No low-stock products"
                    : "No products match your search"}
                </h2>

                <button
                  className="clear-filters-button"
                  onClick={clearFilters}
                >
                  {view === "low-stock"
                    ? "Show all products"
                    : "Clear filters"}
                </button>
              </div>
            ) : (
              <div className="catalogue-layout">
                <div className="catalogue-panel">
                  <p className="catalogue-summary">
                    {view === "low-stock"
                      ? `Showing ${filteredProducts.length} low-stock products`
                      : `Showing ${filteredProducts.length} of ${products.length} products`}
                  </p>

                  <ProductList
                    products={filteredProducts}
                    cart={cart}
                    showStock={
                      view === "low-stock"
                    }
                    onAddToCart={(product) =>
                      dispatch({
                        type: "ADD",
                        product,
                      })
                    }
                    onViewDetails={
                      handleViewDetails
                    }
                  />
                </div>

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
            )}

            {selectedProduct && (
              <div ref={productDetailsRef}>
                <ProductDetails
                  product={selectedProduct}
                  onClose={() =>
                    setSelectedProduct(null)
                  }
                  onAddToCart={(product) =>
                    dispatch({
                      type: "ADD",
                      product,
                    })
                  }
                />
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}

export default App;