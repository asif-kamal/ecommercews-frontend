import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ElectronicCard from "../electronics/ElectronicCard";
import LoadingSpinner from "../shared/LoadingSpinner";

const ShopDisplay = () => {
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const PAGE_SIZE = 12;

  const fetchRandomProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/electronics/shop?size=${PAGE_SIZE}`
      );
      setElectronics(response.data.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [PAGE_SIZE]);

  // Fetch on mount
  useEffect(() => {
    fetchRandomProducts();
  }, [fetchRandomProducts]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading products: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Discover Products</h1>
        <button
          onClick={fetchRandomProducts}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Shuffle Products
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {electronics.map((item) => (
          <ElectronicCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ShopDisplay;