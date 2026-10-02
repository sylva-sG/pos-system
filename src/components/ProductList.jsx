import ProductCard from "./ProductCard";

function ProductList({ products, cart = [], onAddToCart = () => {} }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          inCart={cart.find((item) => item.id === product.id)?.quantity ?? 0}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default ProductList;