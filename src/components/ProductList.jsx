import ProductCard from "./ProductCard";

function ProductList({
  products,
  cart,
  onAddToCart,
  onViewDetails,
}) {
  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          inCart={
            cart.find((item) => item.id === product.id)
              ?.quantity ?? 0
          }
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

export default ProductList;