import React from "react";

const ProductCard = ({ product, onClick }) => {
  return (
    <div
      className="product-card"
      onClick={() => onClick(product)}
    >
      <div className="product-image-container">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-image"
        />
      </div>

      <div className="product-card-content">

        <span className="product-category">
          {product.category}
        </span>

        <h3 className="product-title">
          {product.title}
        </h3>

        <p className="product-price">
          KSh {product.price.toLocaleString()}
        </p>

      </div>
    </div>
  );
};

export default ProductCard;