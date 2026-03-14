import DocumentCard from './DocumentCard';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, subtext, icon }: StatCardProps) {
  return (
    <DocumentCard>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {label}
          </p>
          <p className="text-2xl font-serif text-foreground tabular-nums">{value}</p>
          {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        </div>
        {icon && <div className="text-accent">{icon}</div>}
      </div>
    </DocumentCard>
  );
}
