import { createBrowserRouter } from "react-router-dom";
import Layout from './components/layout/Layout';
import ElectronicsDisplay from './components/electronics/ElectronicsDisplay';
import CartItems from './components/cart/CartItems';  // Create this component if not exists

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <ElectronicsDisplay />
            },
            {
                path: "/computers",
                element: <ElectronicsDisplay />  // Or create specific component
            },
            {
                path: "/tv",
                element: <ElectronicsDisplay />  // Or create specific component
            },
            {
                path: "/audiovideo",
                element: <ElectronicsDisplay />  // Or create specific component
            },
            {
                path: "/shop",
                element: <ElectronicsDisplay />  // Or create specific component
            },
            {
                path: "/cart-items",
                element: <CartItems />
            }
        ]
    }
]);