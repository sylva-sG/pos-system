import { formatPrice } from "../utils/formatPrice";

function ProductCard({ product, inCart, onAddToCart }) {
  const outOfStock = product.stock < 1;
  const maxedOut = inCart >= product.stock;

  return (
    <div className="product-card">
      <h2>{product.title}</h2>
      <p>{formatPrice(product.price)}</p>
      <p>{product.category}</p>
      <img src={product.thumbnail} alt={product.title} />

      <button
        onClick={() => onAddToCart(product)}
        disabled={outOfStock || maxedOut}
      >
        {outOfStock ? "Out of stock" : maxedOut ? "Max in cart" : "Add to cart"}
      </button>
    </div>
  );
}

export default ProductCard;