const ProductDetails = ({ product, onBack }) => {

  if (!product) {
    return null;
  }

  return (
    <div className="product-details">

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back to Products
      </button>

      <div className="product-details-content">

        <div className="product-details-image">
          <img
            src={product.thumbnail}
            alt={product.title}
          />
        </div>

        <div className="product-details-info">

          <h1>
            {product.title}
          </h1>

          <span className="product-details-category">
            {product.category}
          </span>

          <p className="product-details-price">
            KSh {product.price.toLocaleString()}
          </p>

          <p className="product-description">
            {product.description}
          </p>

          <button className="add-to-cart-button">
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;