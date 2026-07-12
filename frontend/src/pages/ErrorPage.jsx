export default function ErrorPage({ message = "Something went wrong." }) {
  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <h1 className="text-2xl font-semibold text-red-600 mb-2">Error</h1>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
