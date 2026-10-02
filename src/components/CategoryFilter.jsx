function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
}

export default SearchBar;