import ElectronicsDisplay from './components/electronics/ElectronicsDisplay';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CartItems from './components/cart/CartItems';  // Create if not exists

function App() {
  return (
    <Routes>
      <Route path="/api/electronics" element={<Layout />}>
        <Route index element={<ElectronicsDisplay />} />
        <Route path="computers" element={<ElectronicsDisplay />} />
        <Route path="tv" element={<ElectronicsDisplay />} />
        <Route path="audiovideo" element={<ElectronicsDisplay />} />
        <Route path="shop" element={<ElectronicsDisplay />} />
        <Route path="cart-items" element={<CartItems />} />
      </Route>
    </Routes>
  );
}

export default App;