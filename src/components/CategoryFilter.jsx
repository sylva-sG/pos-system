const label = (slug) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function CategoryFilter({ categories, selected, onChange }) {
  return (
    <select
      className="category-filter"
      aria-label="Filter by category"
      value={selected}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="all">All categories</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {label(category)}
        </option>
      ))}
    </select>
  );
}

export default CategoryFilter;