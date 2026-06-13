import { Link, useParams } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import DocumentCard from '@/components/DocumentCard';
import StatCard from '@/components/StatCard';
import DataTable from '@/components/DataTable';
import { ArrowLeft, Users, TrendingUp, FileText } from 'lucide-react';

const STUDENTS = [
  { id: '1', matricule: 'MAT-2024-001', nom: 'Diallo Amadou', moyenne: '14,2', rang: 3 },
  { id: '2', matricule: 'MAT-2024-006', nom: 'Diop Mariama', moyenne: '15,1', rang: 1 },
  { id: '3', matricule: 'MAT-2024-018', nom: 'Sy Khadija', moyenne: '14,7', rang: 2 },
  { id: '4', matricule: 'MAT-2024-022', nom: 'Kane Modou', moyenne: '13,9', rang: 4 },
  { id: '5', matricule: 'MAT-2024-031', nom: 'Thiam Aïda', moyenne: '13,5', rang: 5 },
];

const PROGRAMME = [
  { matiere: 'Mathématiques', prof: 'M. Sarr', heures: 5, coef: 4 },
  { matiere: 'Français', prof: 'Mme Ba', heures: 5, coef: 4 },
  { matiere: 'Histoire-Géo', prof: 'M. Ndiaye', heures: 3, coef: 2 },
  { matiere: 'SVT', prof: 'Mme Diop', heures: 3, coef: 3 },
  { matiere: 'Physique-Chimie', prof: 'M. Faye', heures: 3, coef: 3 },
  { matiere: 'Anglais', prof: 'Mme Ndoye', heures: 3, coef: 2 },
];

export default function ClassDetailPage() {
  const { id } = useParams();

  return (
    <div className="animate-fade-in">
      <Link to="/classes" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-3 w-3" /> Retour aux classes
      </Link>

      <PageHeader
        title={`Classe ${id?.toUpperCase()}`}
        description="Détails, programme et liste nominative — Année 2024-2025"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Effectif" value="40" subtext="Élèves inscrits" icon={<Users className="h-5 w-5" />} />
        <StatCard label="Moyenne de classe" value="14,2" subtext="/20 — T1" icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard label="Bulletins générés" value="40" subtext="Trimestre 1" icon={<FileText className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DocumentCard>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Informations
          </h3>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-muted-foreground">Niveau</dt><dd>Collège</dd>
            <dt className="text-muted-foreground">Salle</dt><dd>B-204</dd>
            <dt className="text-muted-foreground">Professeur principal</dt><dd>M. Faye</dd>
            <dt className="text-muted-foreground">Délégué</dt><dd>Diop Mariama</dd>
          </dl>
        </DocumentCard>
        <DocumentCard>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Programme et coefficients
          </h3>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-border">
              {PROGRAMME.map((p) => (
                <tr key={p.matiere}>
                  <td className="py-2 font-medium">{p.matiere}</td>
                  <td className="py-2 text-muted-foreground">{p.prof}</td>
                  <td className="py-2 text-right tabular-nums text-muted-foreground">{p.heures}h</td>
                  <td className="py-2 text-right tabular-nums">×{p.coef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DocumentCard>
      </div>

      <h2 className="font-serif text-xl mb-3">Liste nominative</h2>
      <DataTable
        columns={[
          { key: 'rang', header: 'Rang', className: 'tabular-nums' },
          { key: 'matricule', header: 'Matricule', className: 'font-mono text-xs' },
          {
            key: 'nom',
            header: 'Nom',
            render: (s: typeof STUDENTS[number]) => (
              <Link to={`/students/${s.id}`} className="font-medium hover:text-accent">{s.nom}</Link>
            ),
          },
          { key: 'moyenne', header: 'Moyenne', className: 'tabular-nums' },
        ]}
        data={STUDENTS.sort((a, b) => a.rang - b.rang)}
        keyExtractor={(s) => s.id}
      />
    </div>
  );
}