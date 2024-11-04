import { useState, useEffect } from 'react';
import axios from 'axios';
import ElectronicCard from './ElectronicCard';
import LoadingSpinner from '../shared/LoadingSpinner';

const ElectronicsDisplay = () => {
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchElectronics = async () => {
      try {
        setPageLoading(true);
        const response = await axios.get(`http://localhost:8080/api/electronics?page=${currentPage}&size=12`);
        setElectronics(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalElements);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };

    fetchElectronics();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo(0, 0);
    }
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
      
      {pageLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        // Updated grid to show 2 cards per row on medium screens and 3 on large screens
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {electronics.map((item) => (
            <ElectronicCard key={item.id} item={item} />
          ))}
        </div>
      )}
      
      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0 || pageLoading}
          className={`px-4 py-2 rounded ${
            currentPage === 0 || pageLoading
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Previous
        </button>
        
        <span className="text-gray-600">
          Page {currentPage + 1} of {totalPages} ({totalItems} items)
        </span>
        
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1 || pageLoading}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages - 1 || pageLoading
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ElectronicsDisplay;