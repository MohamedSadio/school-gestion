import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageHeader from '@/components/PageHeader';
import DocumentCard from '@/components/DocumentCard';
import { toast } from 'sonner';

const schema = z.object({
  nom: z.string().min(2, 'Nom requis').max(120),
  sigle: z.string().min(2).max(10),
  adresse: z.string().min(5).max(200),
  telephone: z.string().min(8).max(20),
  email: z.string().email('Email invalide'),
  devise: z.enum(['FCFA', 'EUR', 'USD']),
  anneeScolaire: z.string().regex(/^\d{4}-\d{4}$/, 'Format: 2024-2025'),
  debutAnnee: z.string().min(1),
  finAnnee: z.string().min(1),
  systeme: z.enum(['trimestre', 'semestre']),
  echelle: z.enum(['/20', '/100']),
});

type FormValues = z.infer<typeof schema>;

export default function SettingsPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: 'École Jean-Baptiste Senghor',
      sigle: 'EJBS',
      adresse: 'Avenue Bourguiba, Dakar',
      telephone: '+221 33 824 56 78',
      email: 'direction@ejbs.sn',
      devise: 'FCFA',
      anneeScolaire: '2024-2025',
      debutAnnee: '2024-09-02',
      finAnnee: '2025-06-30',
      systeme: 'trimestre',
      echelle: '/20',
    },
  });

  const onSubmit = async (_data: FormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success('Configuration enregistrée');
  };

  const field = (label: string, name: keyof FormValues, type = 'text', options?: string[]) => (
    <div>
      <label className="block text-xs font-medium mb-1.5">{label}</label>
      {options ? (
        <select {...register(name)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-sm">
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} {...register(name)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-sm" />
      )}
      {errors[name] && <p className="mt-1 text-xs text-destructive">{String(errors[name]?.message)}</p>}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader title="Configuration de l'école" description="Identité, calendrier et règles académiques." />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <DocumentCard>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Identité</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('Nom complet', 'nom')}
            {field('Sigle', 'sigle')}
            {field('Adresse', 'adresse')}
            {field('Téléphone', 'telephone')}
            {field('Email', 'email', 'email')}
            {field('Devise', 'devise', 'text', ['FCFA', 'EUR', 'USD'])}
          </div>
        </DocumentCard>

        <DocumentCard>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Année académique</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {field('Année scolaire', 'anneeScolaire')}
            {field('Date de début', 'debutAnnee', 'date')}
            {field('Date de fin', 'finAnnee', 'date')}
          </div>
        </DocumentCard>

        <DocumentCard>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Règles académiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('Système', 'systeme', 'text', ['trimestre', 'semestre'])}
            {field('Échelle de notation', 'echelle', 'text', ['/20', '/100'])}
          </div>
        </DocumentCard>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-sm hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}