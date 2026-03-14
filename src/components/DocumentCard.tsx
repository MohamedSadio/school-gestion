import { cn } from '@/lib/utils';

interface DocumentCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function DocumentCard({ children, className }: DocumentCardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-lg p-6', className)}>
      {children}
    </div>
  );
}
