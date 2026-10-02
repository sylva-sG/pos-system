import ProductCard from "./ProductCard";

function ProductList({
  products,
  cart = [],
  onAddToCart = () => {},
  onViewDetails,
  showStock = false,
}) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          inCart={
            cart.find((item) => item.id === product.id)
              ?.quantity ?? 0
          }
          showStock={showStock}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

export default ProductList;