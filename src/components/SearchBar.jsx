function SearchBar({ value, onChange }) {
  return (
    <input
      type="search"
      className="search-bar"
      placeholder="Search products..."
      aria-label="Search products"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default SearchBar;