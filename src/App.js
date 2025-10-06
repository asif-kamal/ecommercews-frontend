import ElectronicsDisplay from './components/electronics/ElectronicsDisplay';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CartItems from './components/cart/CartItems';
import SearchResults from './components/search/SearchResults';
import ShopDisplay from './components/shop/ShopDisplay';
import UserProfile from './components/user/UserProfile';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import EmailVerification from './components/pages/EmailVerification';
import OAuth2LoginCallback from './components/pages/OAuth2LoginCallback'; // Add this
import TokenExtractor from './components/pages/TokenExtractor'; // Add this
import AboutProject from './components/pages/AboutProject'; // Add this
import { Provider } from 'react-redux';
import store from './store';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Provider store={store}>
      <CartProvider>
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
            <Route path="oauth2/callback" element={<OAuth2LoginCallback />} /> {/* Add this */}
            <Route path="token-extractor" element={<TokenExtractor />} /> {/* Quick fix for manual token extraction */}
            <Route path="about" element={<AboutProject />} /> {/* About the project page */}
            <Route path="computers" element={<ElectronicsDisplay />} />
            <Route path="tv" element={<ElectronicsDisplay />} />
            <Route path="audiovideo" element={<ElectronicsDisplay />} />
          </Route>
        </Routes>
      </CartProvider>
    </Provider>
  );
}

export default App;