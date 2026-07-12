export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="text-center p-10 text-red-600">
      <p className="mb-3">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm underline">
          Try again
        </button>
      )}
    </div>
  );
}
