import { createBrowserRouter } from "react-router-dom";
import Layout from './components/layout/Layout';
import ElectronicsDisplay from './components/electronics/ElectronicsDisplay';
import CartItems from './components/cart/CartItems';  // Create this component if not exists
import SearchResults from './components/search/SearchResults';  // Create this component if not exists
import ShopDisplay from "./components/shop/ShopDisplay";
import UserProfile from './components/user/UserProfile';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "",
                element: <ElectronicsDisplay />
            },
            {
                path: "computers",
                element: <ElectronicsDisplay />  // Or create specific component
            },
            {
                path: "tv",
                element: <ElectronicsDisplay />  // Or create specific component
            },
            {
                path: "audiovideo",
                element: <ElectronicsDisplay />  // Or create specific component
            },
            {
                path: "cart-items",
                element: <CartItems />
            },
            {
                path: "search",
                element: <SearchResults />
            },
            {
                path: "account",
                element: <UserProfile />
            },
            {
                path: "shop",
                element: <ShopDisplay />
            }
        ]
    }
]);