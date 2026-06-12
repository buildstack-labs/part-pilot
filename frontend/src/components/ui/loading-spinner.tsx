interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label = "טוען..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 animate-fade-in">
      <div
        className="h-10 w-10 animate-spin rounded-full border-[3px] border-border border-t-orange"
        role="status"
        aria-label={label}
      />
      <p className="text-[15px] font-medium text-muted">{label}</p>
    </div>
  );
}
