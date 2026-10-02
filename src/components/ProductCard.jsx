import { formatPrice } from "../utils/formatPrice";

function ProductCard({ product, inCart, onAddToCart }) {
  const outOfStock = product.stock < 1;
  const maxedOut = inCart >= product.stock;

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

        <button
          className="product-card__button"
          onClick={() => onAddToCart(product)}
          disabled={outOfStock || maxedOut}
        >
          {outOfStock ? "Out of stock" : maxedOut ? "Max in cart" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;