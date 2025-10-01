import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock user data - replace with actual API call
  useEffect(() => {
    const fetchUserData = () => {
      try {
        const mockUser = {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          address: {
            street: "123 Main Street",
            city: "San Francisco",
            state: "CA",
            zipCode: "94102",
            country: "United States",
          },
          memberSince: "2023-01-15",
          orderHistory: [
            {
              id: "ORD001",
              date: "2025-09-20",
              total: 1299.99,
              status: "Delivered",
            },
            {
              id: "ORD002",
              date: "2025-08-15",
              total: 599.99,
              status: "Delivered",
            },
            {
              id: "ORD003",
              date: "2025-07-10",
              total: 199.99,
              status: "Processing",
            },
          ],
        };
        setUser(mockUser);
        setLoading(false);
      } catch (err) {
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    // Use a shorter timeout to test
    setTimeout(fetchUserData, 500);
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-300 h-64 rounded"></div>
            <div className="bg-gray-300 h-64 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-red-500 text-center p-4">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Profile Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Full Name
              </label>
              <p className="text-gray-800 font-medium">{user?.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <p className="text-gray-800">{user?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Phone
              </label>
              <p className="text-gray-800">{user?.phone}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Member Since
              </label>
              <p className="text-gray-800">
                {user?.memberSince ? new Date(user.memberSince).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Edit Profile
          </button>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Shipping Address
          </h2>

          <div className="space-y-2">
            <p className="text-gray-800">{user?.address?.street}</p>
            <p className="text-gray-800">
              {user?.address?.city}, {user?.address?.state} {user?.address?.zipCode}
            </p>
            <p className="text-gray-800">{user?.address?.country}</p>
          </div>

          <button className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
            Update Address
          </button>
        </div>
      </div>

      {/* Order History */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Recent Orders
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 font-medium text-gray-600">
                  Order ID
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-600">
                  Date
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-600">
                  Total
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {user?.orderHistory?.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-blue-600">
                    {order.id}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-center">
          <button className="text-blue-500 hover:text-blue-700 font-medium">
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
