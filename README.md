# TechPoint POS

A lightweight point-of-sale (POS) web application for a small electronics and
accessories store. A shop attendant can browse the product catalogue, search
and filter products, add them to a shopping cart, adjust quantities, and
complete a sale. Prices are displayed in Kenyan Shillings (KSh).

This is **Phase 1** — a React frontend that consumes the DummyJSON Products API.
No backend, database, or authentication is included.

## Features

- Fetches an electronics-only product catalogue from the DummyJSON API
- Loading and error states while fetching
- Search products by title, brand, or category
- Filter products by category
- Product cards showing image, title, category, and KSh price
- Add products to a shopping cart
- Increase or decrease item quantities within the stock limit
- Remove individual items, or clear the whole cart
- Live cart total calculated in KSh
- Complete a sale and view a confirmation summary
- Responsive layout for desktop, tablet, and mobile

## Technologies

| Layer | Technology |
|-------|------------|
| UI library | React 19 |
| Build tool | Vite 8 |
| State management | React `useReducer` (cart) + `useState` |
| Styling | Plain CSS |
| Linting | ESLint |
| Data source | DummyJSON Products API |

## API

- **Source:** [DummyJSON Products](https://dummyjson.com/docs/products)
- **Endpoint used:** `GET https://dummyjson.com/products?limit=0`
- The full product list is fetched once, then filtered client-side to
  electronics categories (laptops, smartphones, tablets, mobile-accessories).
- **Response shape:**
  ```json
  {
    "products": [
      {
        "id": 6,
        "title": "Apple MacBook Pro 14 Inch Space Grey",
        "category": "laptops",
        "brand": "Apple",
        "price": 1999.99,
        "thumbnail": "https://...",
        "stock": 76
      }
    ],
    "total": 194
  }
  ```

## Currency handling

The API returns prices in **USD**. The app converts them to KSh at a fixed
rate defined in `src/utils/formatPrice.js`:

```js
const USD_TO_KSH = 130;

export const toKsh = (usd) => Math.round(usd * USD_TO_KSH);
export const formatKsh = (ksh) => `KSh ${ksh.toLocaleString("en-KE")}`;
export const formatPrice = (usd) => formatKsh(toKsh(usd));
```

All displayed prices are converted and formatted with `toLocaleString("en-KE")`.

## Installation

Requires Node.js 18+ and npm.

```bash
npm install
```

## Running the app

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Other scripts

```bash
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # run ESLint
```

## Project structure

```
pos-system/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/
│   │   └── products.js          # DummyJSON API calls
│   ├── cart/
│   │   └── cartReducer.js       # cart state logic
│   ├── components/
│   │   ├── Cart.jsx             # cart panel with totals + checkout
│   │   ├── CategoryFilter.jsx   # category dropdown
│   │   ├── ProductCard.jsx      # single product card
│   │   ├── ProductDetails.jsx   # (currently unused — see Known Issues)
│   │   ├── ProductList.jsx      # grid of product cards
│   │   └── SearchBar.jsx        # search input
│   ├── utils/
│   │   └── formatPrice.js       # USD → KSh conversion helpers
│   ├── App.jsx                  # main app, state, filtering
│   ├── App.css
│   ├── index.css
│   ├── main.jsx                 # entry point
│   └── styles/
│       └── products.css
├── index.html
├── package.json
└── vite.config.js
```

## Team members

| # | Name | Role |
|---|------|------|
| 1 | | Scrum Master / API Integration |
| 2 | | Product Catalogue |
| 3 | | Search & Filtering |
| 4 | | Cart & Sale Calculation |
| 5 | | UI/UX & Styling |
| 6 | | Testing, Quality & Documentation |

## Important decisions

- **DummyJSON as the data source** — free, no authentication, realistic
  product data including stock levels.
- **Electronics-only catalogue** — the app filters the full DummyJSON product
  list down to electronics categories to match the store's scope.
- **`useReducer` for cart state** — cart operations (add, increment,
  decrement, remove, clear) map cleanly to a reducer, keeping `App.jsx`
  readable and the state transitions easy to test.
- **Fixed USD → KSh rate (130)** — the API returns USD only. A single constant
  keeps conversion logic in one place.
- **Stock enforcement inside the reducer** — the `ADD` and `INCREMENT`
  actions both check `product.stock`, so the cart cannot exceed available
  inventory even if the UI misses a check.
- **Client-side search and filter** — the full list is fetched once, then
  filtered in memory with `useMemo` to avoid extra API calls.

## Testing

Manual QA was carried out by Member 6. Results:

| Suite | Coverage | Status |
|-------|----------|--------|
| API | Fetch, loading state, error state, empty response | ✅ |
| Display | Product cards, price conversion, out-of-stock | ✅ |
| Search | By title, brand, category; empty results | ✅ |
| Filter | Category dropdown; combined with search | ✅ |
| Cart | Add, increment, decrement, remove, clear, totals | ✅ |
| Sale | Complete sale, confirmation banner, new sale | ✅ |
| Responsive | 375 px / 768 px / 1440 px | ✅ |

**Key verified calculation:** multiple cart items at different prices render
the correct total. Example: 2 × KSh 1,299 + 1 × KSh 2,599 = **KSh 5,197**.

## Known issues

- **`ProductDetails.jsx` is unused** and its "Add to Cart" button has no
  `onClick` handler.
- **`ProductDetails.jsx` displays USD with a KSh label** — it uses
  `product.price.toLocaleString()` directly instead of the `formatPrice()`
  helper.
- **No retry on API failure** — if the initial fetch fails, users see
  `Error: Failed to fetch products` with no way to retry.
- **Dead API functions** — `getProducts()` and `getProductById()` in
  `src/api/products.js` are never called.
- **No persistence** — cart and sales reset on page reload (out of Phase 1 scope).

## Phase 1 scope

**Included:**
- Electronics product catalogue fetched from the API
- Search and category filtering
- Cart with add / increment / decrement / remove / clear
- Live total calculation in KSh
- Basic frontend sale completion with confirmation
- Loading, error, and empty-cart states
- Responsive layout

**Not included (reserved for Phase 2/3):**
- Flask backend
- SQL database
- Authentication / login
- Persistent sales records
- Real payment processing
- Advanced inventory management

## Git workflow

Two permanent branches:

- `main` — stable/release. Changes arrive only via Pull Request.
- `develop` — integration branch. Feature branches merge here after review.

| Member | Branch |
|--------|--------|
| 1 | `feature/api-integration` |
| 2 | `feature/product-catalogue` |
| 3 | `feature/search-filter` |
| 4 | `feature/cart` |
| 5 | `feature/ui-styling` |
| 6 | `feature/testing-documentation` |