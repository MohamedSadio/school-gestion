import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  titleClassName?: string;
}

export default function PageHeader({ title, description, actions, titleClassName }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 md:mb-8">
      <div className="min-w-0">
        <h1 className={cn('font-serif text-2xl md:text-3xl text-foreground text-balance', titleClassName)}>{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground text-pretty">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
