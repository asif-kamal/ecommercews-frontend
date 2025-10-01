import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";
import Header from "./Header";
import content from "../../data/content.json";
import HeroSection from "./HeroSection";

const Layout = () => {
  const location = useLocation();

  // Check if there's a page parameter in the URL
  const searchParams = new URLSearchParams(location.search);
  const currentPage = searchParams.get("page");

  // Show hero only on home page without pagination
  const shouldShowHero = location.pathname === "/" && !currentPage;

  // Define page titles for different routes
  const getPageInfo = () => {
    switch (location.pathname) {
      case "/account":
        return {
          title: "My Account",
          subtitle: "Manage your profile and orders",
        };
      case "/shop":
        return { title: "Shop", subtitle: "Discover amazing products" };
      case "/cart-items":
        return { title: "Shopping Cart", subtitle: "Review your items" };
      case "/computers":
        return {
          title: "Computers",
          subtitle: "Latest laptops, desktops, and accessories",
        };
      case "/tv":
        return {
          title: "TVs & Displays",
          subtitle: "Premium entertainment systems",
        };
      case "/audiovideo":
        return {
          title: "Audio & Video",
          subtitle: "Professional sound and video equipment",
        };
      case "/search":
        return {
          title: "Search Results",
          subtitle: "Find what you're looking for",
        };
      default:
        return null;
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar - Always shown */}
      <Navbar />

      {/* Hero Section - Only on home page */}
      {shouldShowHero && <HeroSection />}

      {/* Header Section - On all pages except home */}
      {!shouldShowHero && pageInfo && (
        <Header title={pageInfo.title} subtitle={pageInfo.subtitle} />
      )}

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer - Always shown */}
      <Footer content={content?.footer} />
    </div>
  );
};

export default Layout;
