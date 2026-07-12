import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white px-6 py-3 flex items-center justify-between">
      <Link to="/" className="font-semibold text-lg">
        Hackathon Starter
      </Link>
      <nav className="flex gap-4 text-sm text-gray-600">
        {/* Add nav links here */}
      </nav>
    </header>
  );
}
