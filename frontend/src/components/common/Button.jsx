import { cx } from '../../utils/index.js';

const variants = {
  primary: 'bg-ink text-paper hover:bg-ink/90',
  secondary: 'bg-elevated text-ink border border-ink/20 hover:border-ink/40',
  outline: 'bg-transparent text-ink border border-ink/25 hover:bg-ink/5',
  ghost: 'bg-transparent text-ink hover:bg-ink/5',
  ochre: 'bg-ochre text-white hover:bg-ochre/90',
  danger: 'bg-danger text-white hover:bg-danger/90',
  success: 'bg-success text-white hover:brightness-110',
  // brief-conforming: keep old alias so mission pages don't break
  premium: 'bg-ink text-paper hover:bg-ink/90',
};

const sizes = {
  sm: 'h-8 px-3 text-xs rounded-sm gap-1.5',
  md: 'h-10 px-4 text-sm rounded-sm gap-2',
  lg: 'h-12 px-6 text-sm rounded-sm gap-2',
  icon: 'h-10 w-10 rounded-sm',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={cx(
        'inline-flex items-center justify-center font-medium tracking-wide transition-colors duration-150',
        'disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-ink',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
