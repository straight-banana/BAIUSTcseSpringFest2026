export default function Toast({ message, type = "info", onClose }) {
  const colors = {
    info: "bg-blue-600",
    success: "bg-green-600",
    error: "bg-red-600",
  };

  return (
    <div
      className={`fixed bottom-4 right-4 text-white px-4 py-2 rounded-md shadow-lg ${colors[type]}`}
      onClick={onClose}
    >
      {message}
    </div>
  );
}
