export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block mb-3">
      {label && (
        <span className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </span>
      )}
      <input
        className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
    </label>
  );
}
