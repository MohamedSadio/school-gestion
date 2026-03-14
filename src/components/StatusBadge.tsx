import { cn } from '@/lib/utils';

type StatusType = 'success' | 'warning' | 'danger' | 'neutral';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
}

const styles: Record<StatusType, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-accent/10 text-accent border-accent/20',
  danger: 'bg-destructive/10 text-destructive border-destructive/20',
  neutral: 'bg-muted text-muted-foreground border-border',
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-sm',
        styles[status]
      )}
    >
      {label}
    </span>
  );
}
