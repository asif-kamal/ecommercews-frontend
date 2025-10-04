import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2, Mail } from "lucide-react";
import {
  getToken,
  isAuthenticated,
  getUserFromToken,
} from "../../utils/jwt-helper";

// Sample products - In production, fetch from your API
const sampleProducts = [
  { id: 1, name: "Wireless Headphones", price: 79.99, image: "🎧" },
  { id: 2, name: "Smart Watch", price: 199.99, image: "⌚" },
  { id: 3, name: "Laptop Stand", price: 49.99, image: "💻" },
  { id: 4, name: "USB-C Cable", price: 12.99, image: "🔌" },
  { id: 5, name: "Bluetooth Speaker", price: 89.99, image: "🔊" },
  { id: 6, name: "Wireless Mouse", price: 34.99, image: "🖱️" },
];

const CartItems = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication and get user info
  useEffect(() => {
    console.log("CartItems: Checking authentication...");
    if (!isAuthenticated()) {
      console.log("CartItems: User not authenticated, redirecting to login");
      navigate("/login");
      return;
    }

    // Get user info from JWT token
    const userFromToken = getUserFromToken();
    if (userFromToken) {
      setCurrentUser({
        id: userFromToken.id,
        email: userFromToken.email || userFromToken.id, // Use email or fallback to id
        name: userFromToken.name || "User",
      });
    }
    setLoading(false);
  }, [navigate]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, change) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      setOrderStatus("✗ User information not available. Please try again.");
      return;
    }

    const orderData = {
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
      items: cartItems.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      })),
      total: calculateTotal(),
      orderDate: new Date().toISOString(),
    };

    try {
      console.log("Processing checkout for order:", orderData);

      const token = getToken();
      const response = await fetch(
        "http://localhost:8080/api/receipts/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Checkout successful:", result);
        setOrderStatus(
          `✓ Order confirmed! Receipt sent to ${currentUser.email}`
        );
        setCartItems([]);
        setTimeout(() => setOrderStatus(""), 5000);
      } else {
        console.error("Checkout failed:", response.status, response.statusText);
        setOrderStatus("✗ Order failed. Please try again.");
        setTimeout(() => setOrderStatus(""), 5000);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setOrderStatus(
        "✗ Unable to process order. Please check your connection."
      );
      setTimeout(() => setOrderStatus(""), 5000);
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {currentUser?.name}</span>
            <div className="relative bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2">
              <ShoppingCart size={20} />
              Cart ({cartCount} items)
            </div>
          </div>
        </div>

        {orderStatus && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              orderStatus.includes("✓")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {orderStatus}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Available Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="text-5xl mb-4 text-center">
                    {product.image}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-indigo-600 mb-4">
                    ${product.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Your Cart
              </h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart
                    size={48}
                    className="mx-auto text-gray-300 mb-4"
                  />
                  <p className="text-gray-500">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Add some products to get started!
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="border-b pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium flex-1">{item.name}</h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 transition"
                            title="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="bg-gray-200 hover:bg-gray-300 p-1 rounded transition"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="bg-gray-200 hover:bg-gray-300 p-1 rounded transition"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <p className="font-semibold text-indigo-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-indigo-600">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <Mail size={20} />
                    Checkout & Send Receipt
                  </button>

                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Receipt will be sent to: {currentUser?.email}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
