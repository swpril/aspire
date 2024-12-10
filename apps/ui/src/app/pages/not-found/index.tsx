import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-red-600">404</h1>
        <p className="text-2xl font-semibold text-gray-900 md:text-3xl">
          Oops! Page not found.
        </p>
        <p className="mt-4 text-gray-500">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
