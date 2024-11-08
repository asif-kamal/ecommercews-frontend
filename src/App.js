import ElectronicsDisplay from './components/electronics/ElectronicsDisplay';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CartItems from './components/cart/CartItems';  // Create if not exists
import SearchResults from './components/search/SearchResults';  // Import SearchResults component
import ShopDisplay from './components/shop/ShopDisplay';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ElectronicsDisplay />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="shop" element={<ShopDisplay />} />
        <Route path="cart-items" element={<CartItems />} />
      </Route>
    </Routes>
  );
}

export default App;