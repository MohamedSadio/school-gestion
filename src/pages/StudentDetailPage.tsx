import { useParams, Link } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import DocumentCard from '@/components/DocumentCard';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import DataTable from '@/components/DataTable';
import { ArrowLeft, Download, TrendingUp, FileText, Wallet } from 'lucide-react';

const STUDENT = {
  matricule: 'MAT-2024-001',
  nom: 'Diallo',
  prenom: 'Amadou',
  dateNaissance: '12/03/2009',
  lieuNaissance: 'Dakar',
  sexe: 'M',
  classe: '3ème A',
  anneeScolaire: '2024-2025',
  tuteur: 'M. Ousmane Diallo',
  telephone: '+221 77 123 45 67',
  adresse: 'Sicap Liberté 4, Dakar',
  statut: 'actif' as const,
  moyenne: '14,2',
};

const PARCOURS = [
  { id: '1', annee: '2024-2025', classe: '3ème A', moyenne: '14,2', mention: 'Bien', decision: 'En cours' },
  { id: '2', annee: '2023-2024', classe: '4ème B', moyenne: '13,8', mention: 'Assez bien', decision: 'Passage' },
  { id: '3', annee: '2022-2023', classe: '5ème A', moyenne: '12,5', mention: 'Passable', decision: 'Passage' },
  { id: '4', annee: '2021-2022', classe: '6ème B', moyenne: '13,1', mention: 'Assez bien', decision: 'Passage' },
];

const PAIEMENTS = [
  { id: '1', date: '05/10/2024', libelle: 'Scolarité T1', montant: '150.000', statut: 'paye' as const },
  { id: '2', date: '12/09/2024', libelle: 'Inscription', montant: '50.000', statut: 'paye' as const },
  { id: '3', date: '—', libelle: 'Scolarité T2', montant: '150.000', statut: 'impaye' as const },
];

export default function StudentDetailPage() {
  const { id } = useParams();

  return (
    <div className="animate-fade-in">
      <Link to="/students" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-3 w-3" /> Retour aux élèves
      </Link>

      <PageHeader
        title={`${STUDENT.prenom} ${STUDENT.nom}`}
        description={`Matricule ${STUDENT.matricule} — ${STUDENT.classe} · ${STUDENT.anneeScolaire}`}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-sm hover:bg-muted">
            <Download className="h-4 w-4" /> Exporter la fiche
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Moyenne actuelle" value={STUDENT.moyenne} subtext="/20 — T1 2024-2025" icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard label="Bulletins" value="8" subtext="Depuis 2021" icon={<FileText className="h-5 w-5" />} />
        <StatCard label="Solde scolarité" value="150.000" subtext="FCFA dûs — T2" icon={<Wallet className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <DocumentCard>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Identité
            </h3>
            <dl className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <dt className="text-muted-foreground">Nom complet</dt>
              <dd className="text-foreground font-medium">{STUDENT.prenom} {STUDENT.nom}</dd>
              <dt className="text-muted-foreground">Date de naissance</dt>
              <dd className="text-foreground tabular-nums">{STUDENT.dateNaissance}</dd>
              <dt className="text-muted-foreground">Lieu de naissance</dt>
              <dd className="text-foreground">{STUDENT.lieuNaissance}</dd>
              <dt className="text-muted-foreground">Sexe</dt>
              <dd className="text-foreground">{STUDENT.sexe}</dd>
              <dt className="text-muted-foreground">Adresse</dt>
              <dd className="text-foreground">{STUDENT.adresse}</dd>
              <dt className="text-muted-foreground">Tuteur</dt>
              <dd className="text-foreground">{STUDENT.tuteur}</dd>
              <dt className="text-muted-foreground">Téléphone</dt>
              <dd className="text-foreground tabular-nums">{STUDENT.telephone}</dd>
              <dt className="text-muted-foreground">Statut</dt>
              <dd><StatusBadge status="success" label="Actif" /></dd>
            </dl>
          </DocumentCard>
        </div>
        <div>
          <DocumentCard>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Documents
            </h3>
            <div className="space-y-2">
              {['Bulletin T1 2024', 'Certificat de scolarité', 'Bulletin S2 2023-24', 'Bulletin annuel 2023-24'].map((doc) => (
                <button key={doc} className="w-full flex items-center justify-between text-left text-sm px-3 py-2 border border-border rounded-sm hover:bg-muted">
                  <span className="truncate">{doc}</span>
                  <Download className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </DocumentCard>
        </div>
      </div>

      <h2 className="font-serif text-xl mb-3">Historique du parcours scolaire</h2>
      <DataTable
        columns={[
          { key: 'annee', header: 'Année', className: 'tabular-nums' },
          { key: 'classe', header: 'Classe' },
          { key: 'moyenne', header: 'Moyenne', className: 'tabular-nums' },
          { key: 'mention', header: 'Mention' },
          {
            key: 'decision',
            header: 'Décision',
            render: (p: typeof PARCOURS[number]) => (
              <StatusBadge
                status={p.decision === 'Passage' ? 'success' : p.decision === 'Redoublement' ? 'danger' : 'neutral'}
                label={p.decision}
              />
            ),
          },
        ]}
        data={PARCOURS}
        keyExtractor={(p) => p.id}
      />

      <h2 className="font-serif text-xl mb-3 mt-8">Historique financier</h2>
      <DataTable
        columns={[
          { key: 'date', header: 'Date', className: 'tabular-nums' },
          { key: 'libelle', header: 'Libellé' },
          { key: 'montant', header: 'Montant (FCFA)', className: 'tabular-nums text-right' },
          {
            key: 'statut',
            header: 'Statut',
            render: (p: typeof PAIEMENTS[number]) => (
              <StatusBadge status={p.statut === 'paye' ? 'success' : 'danger'} label={p.statut === 'paye' ? 'Payé' : 'Impayé'} />
            ),
          },
        ]}
        data={PAIEMENTS}
        keyExtractor={(p) => p.id}
      />
    </div>
  );
}