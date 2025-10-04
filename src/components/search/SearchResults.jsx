import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ElectronicCard from "../electronics/ElectronicCard";
import LoadingSpinner from "../shared/LoadingSpinner";
import { isAuthenticated } from "../../utils/jwt-helper";
import { useCart } from "../../context/CartContext";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [addToCartMessage, setAddToCartMessage] = useState("");
  const PAGE_SIZE = 12;

  const query = searchParams.get("q") || "";
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the working electronics endpoint with client-side filtering
        const response = await axios.get(
          `http://localhost:8080/api/electronics?page=0&size=100`
        );

        // Filter results based on search query
        const allItems = response.data.content;
        const filteredItems = query
          ? allItems.filter(
              (item) =>
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.brand.toLowerCase().includes(query.toLowerCase()) ||
                item.category.toLowerCase().includes(query.toLowerCase()) ||
                (item.description &&
                  item.description.toLowerCase().includes(query.toLowerCase()))
            )
          : allItems;

        // Implement client-side pagination
        const startIndex = currentPage * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        const paginatedResults = filteredItems.slice(startIndex, endIndex);

        setResults(paginatedResults);
        setTotalPages(Math.ceil(filteredItems.length / PAGE_SIZE));
        setTotalItems(filteredItems.length);
      } catch (err) {
        console.error("Search error:", err);
        setError(`Unable to fetch search results: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setResults([]);
      setTotalItems(0);
      setTotalPages(0);
      setLoading(false);
    }
  }, [query, currentPage]);

  const handleAddToCart = (product) => {
    if (!isAuthenticated()) {
      setAddToCartMessage("Please log in to add items to cart");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    addToCart(product);
    setAddToCartMessage(`✓ ${product.name} added to cart!`);
    setTimeout(() => setAddToCartMessage(""), 3000);

    console.log("Added to cart:", product);
  };
  if (loading) return <LoadingSpinner />;

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for "{query}"
        <span className="text-gray-500 text-lg ml-2">
          ({totalItems} items found)
        </span>
      </h1>

      {/* Add to Cart Message */}
      {addToCartMessage && (
        <div
          className={`mb-4 p-3 rounded-lg text-center ${
            addToCartMessage.includes("✓")
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {addToCartMessage}
        </div>
      )}

      {results.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No results found for "{query}"</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((item) => (
              <ElectronicCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 0}
                className={`px-4 py-2 rounded ${
                  currentPage === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Previous
              </button>

              <span className="text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages - 1}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages - 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
