import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";
import content from "../../data/content.json";
import HeroSection from "./HeroSection";

const Layout = () => {
  const location = useLocation();
  
  // Check if there's a page parameter in the URL
  const searchParams = new URLSearchParams(location.search);
  const currentPage = searchParams.get('page');
  
  // Show hero only on home page without pagination
  const shouldShowHero = location.pathname === "/" && !currentPage;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {shouldShowHero && <HeroSection />}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer content={content?.footer} />
    </div>
  );
};

export default Layout;