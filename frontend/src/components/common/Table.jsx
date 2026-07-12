import { cx } from '../../utils/index.js';

export default function Table({ columns = [], rows = [], empty = 'No data yet.' }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-muted text-xs uppercase tracking-wider">
          <tr>
            {columns.map((c) => (
              <th key={c.key || c} className={cx('px-4 py-2.5 font-medium', c.className)}>
                {c.label ?? c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-muted">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={row.id ?? i} className="border-t border-border hover:bg-surface/60">
                {columns.map((c) => {
                  const key = c.key || c;
                  return (
                    <td key={key} className="px-4 py-3 text-fg">
                      {c.render ? c.render(row) : row[key]}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
