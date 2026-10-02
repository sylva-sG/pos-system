import { formatPrice } from "../utils/formatPrice";

function ProductDetails({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="product-details">
      <button onClick={onClose}>
        ← Back to Products
      </button>

      <div className="product-details-content">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-details-image"
        />

        <div className="product-details-info">
          <p className="product-category">
            {product.category}
          </p>

          <h2>{product.title}</h2>

          <p>{product.description}</p>

          <p>
            <strong>Brand:</strong>{" "}
            {product.brand || "N/A"}
          </p>

          <p>
            <strong>Price:</strong>{" "}
            {formatPrice(product.price)}
          </p>

          <p>
            <strong>Available:</strong>{" "}
            {product.stock}
          </p>

          <p>
            <strong>Rating:</strong>{" "}
            {product.rating}
          </p>

          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock < 1}
          >
            {product.stock < 1
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;