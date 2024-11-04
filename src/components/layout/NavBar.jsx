import React from "react";
import WishList from "../common/WishList";
import AccountIcon from "../common/AccountIcon";
import CartIcon from "../common/CartIcon";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center py-6 px-16 justify-between">
      {/* Logo aligned to the top left */}
      <div>
        <a className="text-3xl text-black" href="/">
          ecommercews
        </a>
      </div>

      {/* Nav items aligned to the top right and displayed right-to-left */}
      <div className="flex flex-1 justify-end items-center">
        <ul className="flex flex-row-reverse gap-10 pr-8">
          <li>
            <NavLink
              to="/computers"
              className="text-lg font-normal text-black hover:text-blue-700"
            >
              Computers
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tv"
              className="text-lg font-normal text-black hover:text-blue-700"
            >
              TV
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/audiovideo"
              className="text-lg font-normal text-black hover:text-blue-700"
            >
              Audio & Video
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/shop"
              className="text-lg font-normal text-black hover:text-blue-700"
            >
              Shop
            </NavLink>
          </li>
        </ul>

        {/* Search Bar aligned with links */}
        <div className="flex justify-center ml-10 items-center">
          <div className="border rounded flex overflow-hidden">
            <div className="flex items-center justify-center px-6">
              <svg
                className="h-4 w-4 text-gray-600"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M10 2a8 8 0 105.293 14.293l5.707 5.707 1.414-1.414-5.707-5.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
              </svg>
              <input
                type="text"
                className="px-4 py-2 outline-none"
                placeholder="Search..."
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
            <button>
              <AccountIcon />
            </button>
          </li>
          <li>
            <Link to="/cart-items">
              <CartIcon />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
