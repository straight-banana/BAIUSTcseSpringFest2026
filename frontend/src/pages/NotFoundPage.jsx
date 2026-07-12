import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-gray-600 mb-4">Page not found.</p>
      <Link to="/" className="text-indigo-600 underline">
        Go home
      </Link>
    </div>
  );
}
