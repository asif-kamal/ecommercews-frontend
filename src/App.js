import ElectronicsDisplay from './components/electronics/ElectronicsDisplay';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CartItems from './components/cart/CartItems';  // Create if not exists
import SearchResults from './components/search/SearchResults';  // Import SearchResults component
import ShopDisplay from './components/shop/ShopDisplay';
import UserProfile from './components/user/UserProfile';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import EmailVerification from './components/pages/EmailVerification';
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ElectronicsDisplay />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="shop" element={<ShopDisplay />} />
          <Route path="cart-items" element={<CartItems />} />
          <Route path="account" element={<UserProfile />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify-email" element={<EmailVerification />} />
          <Route path="computers" element={<ElectronicsDisplay />} />
          <Route path="tv" element={<ElectronicsDisplay />} />
          <Route path="audiovideo" element={<ElectronicsDisplay />} />
        </Route>
      </Routes>
    </Provider>
  );
}

export default App;