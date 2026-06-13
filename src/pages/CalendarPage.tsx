import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import DocumentCard from '@/components/DocumentCard';
import StatusBadge from '@/components/StatusBadge';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';

type EventType = 'composition' | 'fete' | 'culturel' | 'conge' | 'reunion';

interface SchoolEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: EventType;
  semester: 'S1' | 'S2';
  description?: string;
}

const TYPE_META: Record<EventType, { label: string; status: 'success' | 'warning' | 'danger' | 'neutral' }> = {
  composition: { label: 'Composition', status: 'danger' },
  fete: { label: 'Fête', status: 'warning' },
  culturel: { label: 'Journée culturelle', status: 'success' },
  conge: { label: 'Congé', status: 'neutral' },
  reunion: { label: 'Réunion', status: 'neutral' },
};

const INITIAL_EVENTS: SchoolEvent[] = [
  { id: '1', date: '2024-11-12', title: 'Composition T1 — Maths', type: 'composition', semester: 'S1' },
  { id: '2', date: '2024-11-15', title: 'Composition T1 — Français', type: 'composition', semester: 'S1' },
  { id: '3', date: '2024-11-22', title: 'Journée culturelle', type: 'culturel', semester: 'S1' },
  { id: '4', date: '2024-12-06', title: 'Fête de fin de trimestre', type: 'fete', semester: 'S1' },
  { id: '5', date: '2024-12-20', title: 'Vacances de Noël', type: 'conge', semester: 'S1' },
  { id: '6', date: '2025-03-14', title: 'Composition S2', type: 'composition', semester: 'S2' },
  { id: '7', date: '2025-04-18', title: 'Fête de l\'école', type: 'fete', semester: 'S2' },
];

const eventSchema = z.object({
  date: z.string().min(1, 'Date requise'),
  title: z.string().min(2, 'Titre trop court').max(80),
  type: z.enum(['composition', 'fete', 'culturel', 'conge', 'reunion']),
  semester: z.enum(['S1', 'S2']),
  description: z.string().max(200).optional(),
});

type EventForm = z.infer<typeof eventSchema>;

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function CalendarPage() {
  const [events, setEvents] = useState<SchoolEvent[]>(INITIAL_EVENTS);
  const [cursor, setCursor] = useState(new Date(2024, 10, 1));
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: { type: 'composition', semester: 'S1' },
  });

  const monthLabel = cursor.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const lastDay = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday start
  const daysInMonth = lastDay.getDate();

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isoFor = (day: number) =>
    `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const eventsForMonth = events.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === cursor.getMonth() && d.getFullYear() === cursor.getFullYear();
  }).sort((a, b) => a.date.localeCompare(b.date));

  const onSubmit = (data: EventForm) => {
    setEvents([
      ...events,
      { id: String(Date.now()), ...data },
    ]);
    setShowForm(false);
    reset();
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Calendrier scolaire"
        description="Programmes semestriels — compositions, fêtes, journées culturelles et congés."
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Annuler' : 'Nouvel événement'}
          </button>
        }
      />

      {showForm && (
        <DocumentCard className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Programmer un événement
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5">Date</label>
              <input type="date" {...register('date')} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-sm" />
              {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">Titre</label>
              <input {...register('title')} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-sm" />
              {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">Type</label>
              <select {...register('type')} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-sm">
                <option value="composition">Composition</option>
                <option value="fete">Fête</option>
                <option value="culturel">Journée culturelle</option>
                <option value="conge">Congé</option>
                <option value="reunion">Réunion</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">Semestre</label>
              <select {...register('semester')} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-sm">
                <option value="S1">Semestre 1</option>
                <option value="S2">Semestre 2</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1.5">Description (optionnelle)</label>
              <input {...register('description')} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-sm" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-sm hover:opacity-90">
                Enregistrer
              </button>
            </div>
          </form>
        </DocumentCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DocumentCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl capitalize">{monthLabel}</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                  className="p-1.5 border border-border rounded-sm hover:bg-muted"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                  className="p-1.5 border border-border rounded-sm hover:bg-muted"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-border border border-border rounded-sm overflow-hidden">
              {WEEKDAYS.map((d) => (
                <div key={d} className="bg-muted px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
                  {d}
                </div>
              ))}
              {cells.map((day, i) => {
                if (!day) return <div key={i} className="bg-card/50 h-24" />;
                const dayEvents = events.filter((e) => e.date === isoFor(day));
                return (
                  <div key={i} className="bg-card h-24 p-1.5 flex flex-col gap-1 overflow-hidden">
                    <span className="text-xs text-muted-foreground tabular-nums">{day}</span>
                    {dayEvents.slice(0, 2).map((e) => (
                      <div
                        key={e.id}
                        className={cn(
                          'text-[10px] px-1 py-0.5 rounded-sm truncate border',
                          e.type === 'composition' && 'bg-destructive/10 text-destructive border-destructive/20',
                          e.type === 'fete' && 'bg-accent/10 text-accent border-accent/20',
                          e.type === 'culturel' && 'bg-success/10 text-success border-success/20',
                          (e.type === 'conge' || e.type === 'reunion') && 'bg-muted text-muted-foreground border-border'
                        )}
                        title={e.title}
                      >
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 2}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </DocumentCard>
        </div>

        <div>
          <DocumentCard>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Événements du mois
            </h3>
            {eventsForMonth.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun événement programmé.</p>
            ) : (
              <div className="divide-y divide-border">
                {eventsForMonth.map((e) => (
                  <div key={e.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {new Date(e.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </span>
                      <StatusBadge status={TYPE_META[e.type].status} label={TYPE_META[e.type].label} />
                    </div>
                    <p className="text-sm font-medium text-foreground">{e.title}</p>
                    <p className="text-xs text-muted-foreground">Semestre {e.semester[1]}</p>
                  </div>
                ))}
              </div>
            )}
          </DocumentCard>
        </div>
      </div>
    </div>
  );
}