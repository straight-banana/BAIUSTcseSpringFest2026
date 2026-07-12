export default function Table({ columns = [], data = [] }) {
  return (
    <table className="w-full text-sm text-left border-collapse">
      <thead>
        <tr className="border-b bg-gray-50">
          {columns.map((col) => (
            <th key={col.key} className="px-3 py-2 font-medium text-gray-700">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row.id ?? i} className="border-b">
            {columns.map((col) => (
              <td key={col.key} className="px-3 py-2">
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
