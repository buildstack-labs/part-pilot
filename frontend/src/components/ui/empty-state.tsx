interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon = "🔧", title, subtitle }: EmptyStateProps) {
  return (
    <div className="py-12 text-center animate-fade-in">
      <div className="mb-4 text-5xl" aria-hidden>
        {icon}
      </div>
      <h3 className="mb-1.5 text-lg font-bold text-[#2D3748]">{title}</h3>
      {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
    </div>
  );
}
