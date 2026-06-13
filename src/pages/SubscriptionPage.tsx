import PageHeader from '@/components/PageHeader';
import DocumentCard from '@/components/DocumentCard';
import StatusBadge from '@/components/StatusBadge';
import DataTable from '@/components/DataTable';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const PLANS = [
  {
    id: 'essentiel',
    nom: 'Essentiel',
    prix: '45.000',
    periode: 'mois',
    cible: "Jusqu'à 300 élèves",
    features: ['Gestion élèves & classes', 'Notes & bulletins', 'Documents PDF', 'Support email'],
  },
  {
    id: 'pro',
    nom: 'Professionnel',
    prix: '85.000',
    periode: 'mois',
    cible: "Jusqu'à 1 000 élèves",
    features: ['Tout Essentiel', 'Finances & paie', 'Transport, cantine, tenues', 'Calendrier scolaire', 'Support prioritaire'],
    featured: true,
  },
  {
    id: 'etablissement',
    nom: 'Établissement',
    prix: 'Sur devis',
    periode: '',
    cible: 'Effectifs illimités',
    features: ['Tout Professionnel', 'Multi-sites', 'API & intégrations', 'Account manager dédié'],
  },
];

const FACTURES = [
  { id: '1', numero: 'INV-2024-011', date: '01/11/2024', montant: '85.000', statut: 'paye' as const },
  { id: '2', numero: 'INV-2024-010', date: '01/10/2024', montant: '85.000', statut: 'paye' as const },
  { id: '3', numero: 'INV-2024-009', date: '01/09/2024', montant: '85.000', statut: 'paye' as const },
];

export default function SubscriptionPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Abonnement"
        description="Gérez la formule de votre établissement et l'historique de facturation."
      />

      <DocumentCard className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Formule actuelle</p>
            <p className="font-serif text-3xl text-foreground">Professionnel</p>
            <p className="text-sm text-muted-foreground mt-1">85.000 FCFA / mois — Renouvellement le 01/12/2024</p>
          </div>
          <StatusBadge status="success" label="Active" />
        </div>
      </DocumentCard>

      <h2 className="font-serif text-xl mb-3">Formules disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {PLANS.map((p) => (
          <div
            key={p.id}
            className={cn(
              'bg-card border rounded-lg p-6 flex flex-col',
              p.featured ? 'border-accent ring-1 ring-accent/30' : 'border-border'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-xl text-foreground">{p.nom}</h3>
              {p.featured && <StatusBadge status="warning" label="Recommandé" />}
            </div>
            <p className="text-xs text-muted-foreground mb-4">{p.cible}</p>
            <p className="mb-6">
              <span className="font-serif text-3xl text-foreground tabular-nums">{p.prix}</span>
              {p.periode && <span className="text-sm text-muted-foreground"> FCFA / {p.periode}</span>}
            </p>
            <ul className="space-y-2 mb-6 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => toast.success(`Demande pour ${p.nom} envoyée`)}
              className={cn(
                'w-full px-4 py-2 text-sm font-medium rounded-sm transition-opacity hover:opacity-90',
                p.featured ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'
              )}
            >
              {p.id === 'pro' ? 'Formule actuelle' : 'Choisir cette formule'}
            </button>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-xl mb-3">Historique de facturation</h2>
      <DataTable
        columns={[
          { key: 'numero', header: 'Numéro', className: 'font-mono text-xs' },
          { key: 'date', header: 'Date', className: 'tabular-nums' },
          { key: 'montant', header: 'Montant (FCFA)', className: 'tabular-nums text-right' },
          {
            key: 'statut',
            header: 'Statut',
            render: (f: typeof FACTURES[number]) => (
              <StatusBadge status="success" label="Payée" />
            ),
          },
        ]}
        data={FACTURES}
        keyExtractor={(f) => f.id}
      />
    </div>
  );
}