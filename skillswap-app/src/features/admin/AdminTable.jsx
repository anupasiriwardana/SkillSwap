import { Search } from 'lucide-react';
import { Card, Input, Skeleton } from '../../components/ui';

export function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="relative mb-4 sm:w-80">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-9" aria-label={placeholder} />
    </div>
  );
}

/** Simple responsive table. `columns` = [{ key, label, className?, render(row) }]. */
export function AdminTable({ columns, rows, loading, empty }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50/80">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 ${column.className ?? ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading
              ? Array.from({ length: 5 }, (_, i) => (
                  <tr key={i}>
                    <td colSpan={columns.length} className="px-4 py-3">
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))
              : rows.length === 0
                ? (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">
                      {empty}
                    </td>
                  </tr>
                )
                : rows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/60">
                      {columns.map((column) => (
                        <td key={column.key} className={`whitespace-nowrap px-4 py-3 text-slate-700 ${column.className ?? ''}`}>
                          {column.render(row)}
                        </td>
                      ))}
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
