function ProductCard({ product }) {
  return (
    <div>
      <h2>{product.title}</h2>
      <p>KSh {product.price}</p>
      <p>{product.category}</p>
      <img src={product.thumbnail} alt={product.title} />
    </div>
  );
}

export default ProductCard;