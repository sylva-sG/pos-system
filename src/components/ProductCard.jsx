import { formatPrice } from "../utils/formatPrice";

function ProductCard({ product, inCart, onAddToCart, showStock }) {
  const remainingStock = Math.max(product.stock - inCart, 0);
  const outOfStock = remainingStock === 0;

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <img
          className="product-card__image"
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
        />
      </div>

      <div className="product-card__details">
        <p className="product-card__category">{product.category}</p>
        <h2 className="product-card__title">{product.title}</h2>
        <p className="product-card__price">{formatPrice(product.price)}</p>
        {showStock && (
          <p className="product-card__stock">
            {remainingStock} unit{remainingStock === 1 ? "" : "s"} left
          </p>
        )}

        <button
          className="product-card__button"
          onClick={() => onAddToCart(product)}
          disabled={outOfStock}
        >
          {outOfStock ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;