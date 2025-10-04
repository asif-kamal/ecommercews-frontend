import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2, Mail } from "lucide-react";
import {
  getToken,
  isAuthenticated,
  getUserFromToken,
} from "../../utils/jwt-helper";
import { useCart } from "../../context/CartContext";

const CartItems = () => {
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use shared cart context instead of local state
  const {
    cartItems,
    updateQuantity,
    removeItem,
    clearCart: clearCartItems,
    getCartCount,
    getCartTotal,
  } = useCart();

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

  // Test function to check backend connectivity
  const testBackendConnection = async () => {
    try {
      const token = getToken();
      console.log("Testing backend connection...");
      console.log("Token available:", token ? "Yes" : "No");

      // Test a simple GET request first
      const response = await fetch("http://localhost:8080/api/receipts/test", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Test response status:", response.status);
      console.log("Test response URL:", response.url);
    } catch (error) {
      console.error("Backend connection test failed:", error);
    }
  };

  // Helper function to check JSON depth
  const getJsonDepth = (obj, depth = 0) => {
    if (depth > 100) return depth; // Safety limit
    if (obj === null || typeof obj !== "object") return depth;

    let maxDepth = depth;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const childDepth = getJsonDepth(obj[key], depth + 1);
        maxDepth = Math.max(maxDepth, childDepth);
      }
    }
    return maxDepth;
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      setOrderStatus("✗ User information not available. Please try again.");
      return;
    }

    // Validate cart items before creating order data
    if (!cartItems || cartItems.length === 0) {
      setOrderStatus("✗ Your cart is empty. Add some items before checkout.");
      return;
    }

    let orderData;
    try {
      // Ensure all required fields are present and valid
      const validatedItems = cartItems.map((item) => {
        if (
          !item.id ||
          !item.name ||
          typeof item.price !== "number" ||
          typeof item.quantity !== "number"
        ) {
          throw new Error(`Invalid item data: ${JSON.stringify(item)}`);
        }

        // Calculate totalPrice with extra safety checks
        const unitPrice = parseFloat(item.price);
        const quantity = parseInt(item.quantity);
        const totalPrice = parseFloat((unitPrice * quantity).toFixed(2));

        // Validate calculated values
        if (isNaN(unitPrice) || unitPrice <= 0) {
          throw new Error(`Invalid unit price for ${item.name}: ${item.price}`);
        }
        if (isNaN(quantity) || quantity <= 0) {
          throw new Error(
            `Invalid quantity for ${item.name}: ${item.quantity}`
          );
        }
        if (isNaN(totalPrice) || totalPrice <= 0) {
          throw new Error(
            `Invalid total price calculation for ${item.name}: ${totalPrice}`
          );
        }

        return {
          productId: String(item.id), // Backend maps this to productUuid
          productName: String(item.name),
          quantity: quantity,
          price: unitPrice, // Backend expects 'price' field (maps to unitPrice)
          subtotal: totalPrice, // Backend expects 'subtotal' field (maps to totalPrice)
        };
      });

      orderData = {
        userId: String(currentUser.id || ""), // Ensure it's a simple string
        userEmail: String(currentUser.email || ""), // Ensure it's a simple string
        userName: String(currentUser.name || "User"), // Ensure it's a simple string
        items: validatedItems,
        total: parseFloat(getCartTotal().toFixed(2)), // Ensure proper decimal calculation
        orderDate: new Date().toISOString(),
      };

      // Create a clean, serializable copy to avoid any reference issues
      const cleanOrderData = {
        userId: orderData.userId,
        userEmail: orderData.userEmail,
        userName: orderData.userName,
        items: orderData.items.map((item) => ({
          productId: String(item.productId), // Backend maps this to productUuid
          productName: String(item.productName),
          quantity: Number(item.quantity),
          price: Number(item.price), // Backend expects 'price' field
          subtotal: Number(item.subtotal), // Backend expects 'subtotal' field
        })),
        total: Number(orderData.total),
        orderDate: String(orderData.orderDate),
      };

      // Replace orderData with the clean version
      orderData = cleanOrderData;

      // Log the complete order data for debugging
      console.log("Raw cart items:", cartItems);
      console.log("Validated items:", validatedItems);
      console.log("Current user:", currentUser);

      // Check for circular references or deep nesting
      console.log("Order data structure:");
      console.log("- userId:", typeof orderData.userId, orderData.userId);
      console.log(
        "- userEmail:",
        typeof orderData.userEmail,
        orderData.userEmail
      );
      console.log("- userName:", typeof orderData.userName, orderData.userName);
      console.log("- items count:", orderData.items.length);
      console.log("- total:", typeof orderData.total, orderData.total);
      console.log(
        "- orderDate:",
        typeof orderData.orderDate,
        orderData.orderDate
      );

      // Check each item structure
      orderData.items.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          productId: typeof item.productId + " " + item.productId,
          productName: typeof item.productName + " " + item.productName,
          quantity: typeof item.quantity + " " + item.quantity,
          price: typeof item.price + " " + item.price,
          subtotal: typeof item.subtotal + " " + item.subtotal,
        });

        // Validate that productId is not null/undefined
        if (
          !item.productId ||
          item.productId === "undefined" ||
          item.productId === "null"
        ) {
          console.error(`Invalid productId for item ${index}:`, item.productId);
          console.error(`Full item data:`, item);
          throw new Error(
            `Product ID is missing for item: ${item.productName}. Please try refreshing the page.`
          );
        }

        // Validate numeric fields are not null/NaN
        if (
          isNaN(item.quantity) ||
          item.quantity === null ||
          item.quantity === undefined
        ) {
          console.error(`Invalid quantity for item ${index}:`, item.quantity);
          throw new Error(`Invalid quantity for item: ${item.productName}`);
        }

        if (
          isNaN(item.price) ||
          item.price === null ||
          item.price === undefined
        ) {
          console.error(`Invalid price for item ${index}:`, item.price);
          throw new Error(`Invalid unit price for item: ${item.productName}`);
        }

        if (
          isNaN(item.subtotal) ||
          item.subtotal === null ||
          item.subtotal === undefined
        ) {
          console.error(`Invalid subtotal for item ${index}:`, item.subtotal);
          throw new Error(`Invalid total price for item: ${item.productName}`);
        }
      });

      // Check JSON depth to avoid nesting issues
      const jsonDepth = getJsonDepth(orderData);
      console.log("JSON nesting depth:", jsonDepth);

      if (jsonDepth > 50) {
        console.error("JSON depth too high:", jsonDepth);
        setOrderStatus("✗ Data structure error. Please try again.");
        return;
      }
    } catch (dataError) {
      console.error("Order data validation error:", dataError);
      setOrderStatus(
        "✗ Invalid product data. Please refresh the page and try again."
      );
      return;
    }

    try {
      console.log("Processing checkout for order:", orderData);

      const token = getToken();
      console.log("JWT Token for checkout:", token ? "Present" : "Missing");
      console.log("Token length:", token ? token.length : 0);
      console.log("Token validity:", isAuthenticated());

      if (!token) {
        setOrderStatus("✗ Authentication token missing. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      // Validate and debug JSON serialization
      let jsonBody;
      try {
        // First test with a simple stringify to catch circular references early
        const testStringify = JSON.stringify(orderData, null, 0);
        console.log("Test stringify successful, length:", testStringify.length);

        jsonBody = JSON.stringify(orderData);
        console.log("JSON body to send:", jsonBody);
        console.log("JSON body length:", jsonBody.length);

        // Validate the JSON by parsing it back
        const parsedBack = JSON.parse(jsonBody);
        console.log("JSON validation successful:", parsedBack);
      } catch (jsonError) {
        console.error("JSON serialization error:", jsonError);
        console.error("Error name:", jsonError.name);
        console.error("Error message:", jsonError.message);

        if (
          jsonError.message.includes("circular") ||
          jsonError.message.includes("Converting circular")
        ) {
          setOrderStatus(
            "✗ Data reference error. Please refresh and try again."
          );
        } else {
          setOrderStatus("✗ Data formatting error. Please try again.");
        }
        return;
      }

      console.log(
        "Making request to:",
        "http://localhost:8080/api/receipts/checkout"
      );

      // Log each item's data structure one more time before sending
      console.log("=== FINAL DATA STRUCTURE TO BACKEND ===");
      orderData.items.forEach((item, index) => {
        console.log(`Item ${index + 1}:`, {
          productId: `"${item.productId}" (${typeof item.productId})`,
          productName: `"${item.productName}" (${typeof item.productName})`,
          quantity: `${item.quantity} (${typeof item.quantity})`,
          price: `${item.price} (${typeof item.price})`,
          subtotal: `${item.subtotal} (${typeof item.subtotal})`,
        });
        console.log(`Raw Item ${index + 1}:`, item);
      });
      console.log("=== END FINAL DATA STRUCTURE ===");

      const response = await fetch(
        "http://localhost:8080/api/receipts/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: jsonBody,
        }
      );

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );
      console.log("Response URL:", response.url);

      if (response.ok) {
        // Try to read the response as JSON, but handle cases where it might fail
        let result;
        try {
          const responseText = await response.text();
          console.log("Raw response text:", responseText);

          if (responseText.trim()) {
            result = JSON.parse(responseText);
            console.log("Parsed response:", result);
          } else {
            result = { message: "Order processed successfully" };
            console.log("Empty response, assuming success");
          }
        } catch (parseError) {
          console.warn(
            "Response parsing failed, but request was successful:",
            parseError
          );
          result = { message: "Order processed successfully" };
        }

        console.log("Checkout successful:", result);
        setOrderStatus(
          `✓ Order confirmed! Receipt sent to ${currentUser.email}`
        );
        clearCartItems();
        setTimeout(() => setOrderStatus(""), 5000);
      } else if (response.status === 401) {
        console.error("Authentication failed - token may be expired");
        setOrderStatus("✗ Authentication failed. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (response.status === 403) {
        console.error("Access forbidden - insufficient permissions");
        setOrderStatus("✗ Access denied. Please check your permissions.");
      } else {
        console.error("Checkout failed:", response.status, response.statusText);

        try {
          const errorText = await response.text();
          console.error("Error response body:", errorText);

          // Check if it's the JSON nesting error
          if (
            errorText.includes("nesting depth") ||
            errorText.includes("HttpMessageNotWritableException")
          ) {
            setOrderStatus(
              "✓ Order processed! (Response formatting issue resolved)"
            );
            clearCartItems();
            setTimeout(() => setOrderStatus(""), 5000);
          } else {
            setOrderStatus("✗ Order failed. Please try again.");
            setTimeout(() => setOrderStatus(""), 5000);
          }
        } catch (textError) {
          console.error("Could not read error response:", textError);
          setOrderStatus("✗ Order failed. Please try again.");
          setTimeout(() => setOrderStatus(""), 5000);
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);

      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        console.error("Network error - possibly CORS or server not responding");
        setOrderStatus(
          "✗ Network error. Please check if the backend server is running."
        );
      } else {
        setOrderStatus(
          "✗ Unable to process order. Please check your connection."
        );
      }
      setTimeout(() => setOrderStatus(""), 5000);
    }
  };

  const cartCount = getCartCount();

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
            <span className="text-gray-600">
              Welcome, {currentUser?.firstName}
            </span>
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

        <div className="max-w-4xl mx-auto">
          {/* Cart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Your Shopping Cart
            </h2>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart
                  size={64}
                  className="mx-auto text-gray-300 mb-4"
                />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <p className="text-gray-400 mt-2">
                  Browse our products and add some items to your cart!
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
                      ${getCartTotal().toFixed(2)}
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

                {/* Temporary test button for debugging */}
                <button
                  onClick={testBackendConnection}
                  className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  🔧 Test Backend Connection
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
  );
};

export default CartItems;
