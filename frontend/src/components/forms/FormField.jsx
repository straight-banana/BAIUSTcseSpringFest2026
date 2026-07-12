import { forwardRef } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react';

const STATE_RING = {
  default: 'border-border focus-within:border-brand focus-within:ring-brand/30',
  success: 'border-success/60 focus-within:border-success focus-within:ring-success/30',
  warning: 'border-warning/60 focus-within:border-warning focus-within:ring-warning/30',
  error: 'border-danger/70 focus-within:border-danger focus-within:ring-danger/30',
  loading: 'border-brand/60 focus-within:border-brand focus-within:ring-brand/30',
  disabled: 'border-border bg-elevated/50 opacity-70',
};

const STATE_ICON = {
  success: <CheckCircle2 size={16} className="text-success" />,
  warning: <AlertTriangle size={16} className="text-warning" />,
  error: <XCircle size={16} className="text-danger" />,
  loading: <Loader2 size={16} className="text-brand animate-spin" />,
};

const STATE_TEXT = {
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-danger',
};

const FormField = forwardRef(function FormField(
  { label, hint, message, state = 'default', leadingIcon, className = '', id, ...inputProps },
  ref
) {
  const fieldId = id || inputProps.name || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <label htmlFor={fieldId} className={`block ${className}`}>
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-fg">{label}</span>
      )}
      <span
        className={`flex items-center gap-2 h-11 px-3 rounded-lg border bg-surface transition ring-0 focus-within:ring-4 ${STATE_RING[state]}`}
      >
        {leadingIcon && <span className="text-muted shrink-0">{leadingIcon}</span>}
        <input
          ref={ref}
          id={fieldId}
          disabled={state === 'disabled' || inputProps.disabled}
          className="flex-1 min-w-0 bg-transparent outline-none text-sm text-fg placeholder:text-subtle disabled:cursor-not-allowed"
          {...inputProps}
        />
        {STATE_ICON[state] && <span className="shrink-0">{STATE_ICON[state]}</span>}
      </span>
      {(message || hint) && (
        <span className={`mt-1.5 block text-xs ${STATE_TEXT[state] || 'text-muted'}`}>
          {message || hint}
        </span>
      )}
    </label>
  );
});

export default FormField;
