import React from 'react';

const TestUserProfile = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">TEST: My Account Page</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-lg">This is a test component to verify the account route is working.</p>
        <p className="text-sm text-gray-600 mt-4">If you can see this, the routing is working correctly.</p>
      </div>
    </div>
  );
};

export default TestUserProfile;