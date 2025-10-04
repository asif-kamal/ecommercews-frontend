import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ElectronicCard from "./ElectronicCard";
import LoadingSpinner from "../shared/LoadingSpinner";
import { isAuthenticated } from "../../utils/jwt-helper";
import { useCart } from "../../context/CartContext";

const ElectronicsDisplay = () => {
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [addToCartMessage, setAddToCartMessage] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Get current page from URL or default to 0
  const currentPage = parseInt(searchParams.get("page")) || 0;
  const PAGE_SIZE = 12;

  useEffect(() => {
    const fetchElectronics = async () => {
      try {
        setLoading(true);
        console.log(
          "Fetching electronics from:",
          `http://localhost:8080/api/electronics?page=${currentPage}&size=${PAGE_SIZE}`
        );
        const response = await axios.get(
          `http://localhost:8080/api/electronics?page=${currentPage}&size=${PAGE_SIZE}`
        );
        console.log("Response received:", response.data);
        setElectronics(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalElements);
      } catch (err) {
        console.error("Error fetching electronics:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchElectronics();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setSearchParams({ page: currentPage + 1 });
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setSearchParams({ page: currentPage - 1 });
      window.scrollTo(0, 0);
    }
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated()) {
      setAddToCartMessage("Please log in to add items to cart");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    // Use the shared cart context to add the item
    addToCart(product);
    setAddToCartMessage(`✓ ${product.name} added to cart!`);
    setTimeout(() => setAddToCartMessage(""), 3000);

    console.log("Added to cart:", product);
  };
  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading electronics: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Electronics Catalog</h1>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {electronics.map((item) => (
          <ElectronicCard
            key={item.id}
            item={item}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          onClick={handlePrevPage}
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
          Page {currentPage + 1} of {totalPages} ({totalItems} items)
        </span>

        <button
          onClick={handleNextPage}
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
    </div>
  );
};

export default ElectronicsDisplay;
