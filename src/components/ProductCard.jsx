import { formatPrice } from "../utils/formatPrice";

function ProductCard({ product, inCart, onAddToCart }) {
  const outOfStock = product.stock < 1;
  const maxedOut = inCart >= product.stock;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          className="product-image"
          src={product.thumbnail}
          alt={product.title}
        />
      </div>

      <div className="product-card-content">
        <p className="product-category">{product.category}</p>

        <h2 className="product-title">{product.title}</h2>

        <p className="product-price">
          {formatPrice(product.price)}
        </p>

        <button
          onClick={() => onAddToCart(product)}
          disabled={outOfStock || maxedOut}
        >
          {outOfStock
            ? "Out of stock"
            : maxedOut
            ? "Max in cart"
            : "Add to cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;