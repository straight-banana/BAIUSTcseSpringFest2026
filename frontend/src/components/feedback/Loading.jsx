import Loading from '../ui/Spinner.jsx';

export default function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted">
      <Loading size={28} />
      <p className="text-xs">{label}</p>
    </div>
  );
}
