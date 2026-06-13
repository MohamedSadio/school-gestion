import { Link } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import { ChevronRight } from 'lucide-react';

const CLASSES = [
  { id: '6a', nom: '6ème A', niveau: 'Collège', effectif: 38, prof: 'M. Sarr', moyenne: '12,8' },
  { id: '6b', nom: '6ème B', niveau: 'Collège', effectif: 35, prof: 'Mme Ba', moyenne: '13,1' },
  { id: '5a', nom: '5ème A', niveau: 'Collège', effectif: 36, prof: 'M. Ndiaye', moyenne: '12,4' },
  { id: '4b', nom: '4ème B', niveau: 'Collège', effectif: 34, prof: 'Mme Diop', moyenne: '13,5' },
  { id: '3a', nom: '3ème A', niveau: 'Collège', effectif: 40, prof: 'M. Faye', moyenne: '14,2' },
  { id: 'tle', nom: 'Tle S', niveau: 'Lycée', effectif: 28, prof: 'M. Camara', moyenne: '13,9' },
];

export default function ClassesPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Classes"
        description="Vue d'ensemble des classes et de leurs effectifs."
      />
      <DataTable
        columns={[
          {
            key: 'nom',
            header: 'Classe',
            render: (c: typeof CLASSES[number]) => (
              <Link to={`/classes/${c.id}`} className="font-medium text-foreground hover:text-accent">
                {c.nom}
              </Link>
            ),
          },
          { key: 'niveau', header: 'Niveau' },
          { key: 'effectif', header: 'Effectif', className: 'tabular-nums' },
          { key: 'prof', header: 'Professeur principal' },
          { key: 'moyenne', header: 'Moyenne', className: 'tabular-nums' },
          {
            key: 'actions',
            header: '',
            render: (c: typeof CLASSES[number]) => (
              <Link to={`/classes/${c.id}`} className="inline-flex items-center text-xs text-muted-foreground hover:text-accent">
                Détails <ChevronRight className="h-3 w-3" />
              </Link>
            ),
          },
        ]}
        data={CLASSES}
        keyExtractor={(c) => c.id}
      />
    </div>
  );
}