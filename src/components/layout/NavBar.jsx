import React, { useState } from "react";
import WishList from "../common/WishList";
import AccountIcon from "../common/AccountIcon";
import CartIcon from "../common/CartIcon";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/jwt-helper";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { getCartCount } = useCart();

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const handleAccountClick = () => {
    if (isAuthenticated()) {
      navigate("/account");
    } else {
      navigate("/login");
    }
  };

  const handleCategoryClick = (category) => {
    if (category === "shop") {
      navigate("/shop");
    } else {
      navigate(`/search?q=${encodeURIComponent(category)}`);
    }
  };

  return (
    <nav className="flex items-center py-6 px-16 justify-between">
      {/* Logo aligned to the top left */}
      <div>
        <Link className="text-3xl text-black" to="/">
          ecommercews
        </Link>
      </div>

      {/* Nav items aligned to the top right and displayed right-to-left */}
      <div className="flex flex-1 justify-end items-center">
        <ul className="flex flex-row-reverse gap-10 pr-8">
          <li>
            <button
              onClick={() => handleCategoryClick("computer")}
              className="text-lg font-normal text-black hover:text-blue-700"
            >
              Computers
            </button>
          </li>
          <li>
            <button
              onClick={() => handleCategoryClick("tv")}
              className="text-lg font-normal text-black hover:text-blue-700"
            >
              TV
            </button>
          </li>
          <li>
            <button
              onClick={() => handleCategoryClick("audio video")}
              className="text-lg font-normal text-black hover:text-blue-700"
            >
              Audio & Video
            </button>
          </li>
          <li>
            <button
              onClick={() => handleCategoryClick("shop")}
              className="text-lg font-normal text-black hover:text-blue-700"
            >
              Shop
            </button>
          </li>
        </ul>

        {/* Search Bar aligned with links */}
        <div className="flex justify-center ml-10 items-center">
          <div className="border rounded flex overflow-hidden">
            <div className="flex items-center justify-center px-6">
              <button
                onClick={handleSearch}
                className="hover:text-blue-600 transition-colors"
              >
                <svg
                  className="h-4 w-4 text-gray-600"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 2a8 8 0 105.293 14.293l5.707 5.707 1.414-1.414-5.707-5.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
                </svg>
              </button>
              <input
                type="text"
                className="px-4 py-2 outline-none"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Action Item Icons */}
      <div className="flex flex-wrap items-center ml-6">
        <ul className="flex items-center gap-8">
          <li>
            <button>
              <WishList />
            </button>
          </li>
          <li>
            <button onClick={handleAccountClick}>
              <AccountIcon />
            </button>
          </li>
          <li>
            <Link to="/cart-items" className="relative">
              <CartIcon />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
