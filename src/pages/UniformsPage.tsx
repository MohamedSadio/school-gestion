import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { Shirt, Package, AlertCircle } from 'lucide-react';

const STOCK = [
  { id: '1', article: 'Blouse blanche — Taille S', stock: 24, alloues: 156, seuil: 20, statut: 'ok' as const },
  { id: '2', article: 'Blouse blanche — Taille M', stock: 8, alloues: 198, seuil: 20, statut: 'bas' as const },
  { id: '3', article: 'Blouse blanche — Taille L', stock: 42, alloues: 110, seuil: 20, statut: 'ok' as const },
  { id: '4', article: 'Tenue sport — Taille S', stock: 0, alloues: 145, seuil: 15, statut: 'rupture' as const },
  { id: '5', article: 'Tenue sport — Taille M', stock: 32, alloues: 178, seuil: 15, statut: 'ok' as const },
  { id: '6', article: 'Cravate uniforme', stock: 12, alloues: 412, seuil: 30, statut: 'bas' as const },
];

const STATUT_META: Record<string, { label: string; status: 'success' | 'warning' | 'danger' }> = {
  ok: { label: 'En stock', status: 'success' },
  bas: { label: 'Stock bas', status: 'warning' },
  rupture: { label: 'Rupture', status: 'danger' },
};

export default function UniformsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Tenues & Blouses" description="Gestion du stock et des distributions d'uniformes." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Articles en stock" value="118" subtext="6 références" icon={<Package className="h-5 w-5" />} />
        <StatCard label="Distribués" value="1.199" subtext="Cette année" icon={<Shirt className="h-5 w-5" />} />
        <StatCard label="Alertes" value="3" subtext="Stocks bas / ruptures" icon={<AlertCircle className="h-5 w-5" />} />
      </div>
      <DataTable
        columns={[
          { key: 'article', header: 'Article' },
          { key: 'stock', header: 'Stock', className: 'tabular-nums' },
          { key: 'alloues', header: 'Distribués', className: 'tabular-nums' },
          { key: 'seuil', header: 'Seuil min.', className: 'tabular-nums' },
          {
            key: 'statut',
            header: 'Statut',
            render: (s: typeof STOCK[number]) => (
              <StatusBadge status={STATUT_META[s.statut].status} label={STATUT_META[s.statut].label} />
            ),
          },
        ]}
        data={STOCK}
        keyExtractor={(s) => s.id}
      />
    </div>
  );
}