function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <select
      value={selectedCategory}
      onChange={(e) => onCategoryChange(e.target.value)}
    >
      <option value="all">All categories</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}

export default CategoryFilter;