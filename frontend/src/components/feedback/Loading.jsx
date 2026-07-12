import Spinner from "../ui/Spinner.jsx";

export default function Loading({ fullScreen = false, label = "Loading..." }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 text-gray-500 ${
        fullScreen ? "min-h-screen" : "p-8"
      }`}
    >
      <Spinner size={32} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
