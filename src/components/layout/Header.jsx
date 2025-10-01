import React from "react";

const Header = ({ title, subtitle, showOnAllPages = false }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {title && (
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          )}
          {subtitle && (
            <p className="text-lg md:text-xl opacity-90">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
