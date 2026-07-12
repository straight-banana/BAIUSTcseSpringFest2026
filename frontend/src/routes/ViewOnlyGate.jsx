import { Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Wraps a route element and — when the current role is in `readOnlyRoles` —
 * shows a "view-only" banner and disables all form controls / buttons /
 * links within (via pointer-events + inert-style attributes).
 * Presentation-only: does not alter routing or business logic.
 */
export default function ViewOnlyGate({ children, readOnlyRoles = ['student'], label = 'Automated plan — view only' }) {
  const { role } = useAuth();
  const readOnly = readOnlyRoles.includes('*') || readOnlyRoles.includes(role);
  if (!readOnly) return children;

  return (
    <div>
      <div
        role="status"
        className="sticky top-[92px] z-10 mx-4 sm:mx-6 mt-4 flex items-center gap-2 border border-brand/40 bg-brand-soft text-fg px-3 py-2 rounded-sm"
      >
        <Eye size={14} />
        <span className="text-xs font-medium">{label} — seat assignments are generated automatically and cannot be edited.</span>
      </div>

      <fieldset
        disabled
        className="min-w-0 border-0 p-0 m-0 [&_button:not([data-viewonly-allow])]:pointer-events-none [&_button:not([data-viewonly-allow])]:opacity-60 [&_input]:pointer-events-none [&_select]:pointer-events-none [&_textarea]:pointer-events-none"
      >
        {children}
      </fieldset>
    </div>
  );
}
