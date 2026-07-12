export default function EmptyState({
  title = "Nothing here yet",
  description = "",
  action = null,
}) {
  return (
    <div className="text-center p-10 text-gray-500">
      <h3 className="font-medium text-gray-700 mb-1">{title}</h3>
      {description && <p className="text-sm mb-3">{description}</p>}
      {action}
    </div>
  );
}
