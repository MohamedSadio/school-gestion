import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { Bus, Users, Route } from 'lucide-react';

const LIGNES = [
  { id: '1', code: 'L-01', itineraire: 'Sicap Liberté → École', chauffeur: 'M. Sow', capacite: 32, inscrits: 28, statut: 'actif' as const },
  { id: '2', code: 'L-02', itineraire: 'Yoff → École', chauffeur: 'M. Diouf', capacite: 32, inscrits: 30, statut: 'actif' as const },
  { id: '3', code: 'L-03', itineraire: 'Parcelles → École', chauffeur: 'M. Cissé', capacite: 28, inscrits: 25, statut: 'actif' as const },
  { id: '4', code: 'L-04', itineraire: 'Almadies → École', chauffeur: 'M. Mbaye', capacite: 28, inscrits: 12, statut: 'maintenance' as const },
];

export default function TransportPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Transport scolaire" description="Gestion des lignes de bus, chauffeurs et inscriptions." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Lignes actives" value="3" subtext="sur 4 lignes" icon={<Route className="h-5 w-5" />} />
        <StatCard label="Élèves transportés" value="95" subtext="sur 120 places" icon={<Users className="h-5 w-5" />} />
        <StatCard label="Bus en service" value="4" subtext="1 en maintenance" icon={<Bus className="h-5 w-5" />} />
      </div>
      <DataTable
        columns={[
          { key: 'code', header: 'Ligne', className: 'font-mono text-xs' },
          { key: 'itineraire', header: 'Itinéraire' },
          { key: 'chauffeur', header: 'Chauffeur' },
          {
            key: 'occupation',
            header: 'Occupation',
            render: (l: typeof LIGNES[number]) => (
              <span className="tabular-nums">{l.inscrits}/{l.capacite}</span>
            ),
          },
          {
            key: 'statut',
            header: 'Statut',
            render: (l: typeof LIGNES[number]) => (
              <StatusBadge
                status={l.statut === 'actif' ? 'success' : 'warning'}
                label={l.statut === 'actif' ? 'Actif' : 'Maintenance'}
              />
            ),
          },
        ]}
        data={LIGNES}
        keyExtractor={(l) => l.id}
      />
    </div>
  );
}