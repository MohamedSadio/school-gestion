import PageHeader from '@/components/PageHeader';
import DocumentCard from '@/components/DocumentCard';
import StatCard from '@/components/StatCard';
import DataTable from '@/components/DataTable';
import { UtensilsCrossed, Users, Wallet } from 'lucide-react';

const MENU = [
  { jour: 'Lundi', entree: 'Salade de crudités', plat: 'Riz au poisson (Thiéboudienne)', dessert: 'Fruit de saison' },
  { jour: 'Mardi', entree: 'Soupe de légumes', plat: 'Poulet rôti, pommes vapeur', dessert: 'Yaourt' },
  { jour: 'Mercredi', entree: 'Avocat vinaigrette', plat: 'Mafé de bœuf', dessert: 'Fruit' },
  { jour: 'Jeudi', entree: 'Salade verte', plat: 'Pâtes à la sauce tomate', dessert: 'Flan' },
  { jour: 'Vendredi', entree: 'Carottes râpées', plat: 'Yassa poulet', dessert: 'Fruit' },
];

const ABONNES = [
  { id: '1', eleve: 'Diallo Amadou', classe: '3ème A', formule: 'Mensuel', montant: '25.000', statut: 'À jour' },
  { id: '2', eleve: 'Diop Mariama', classe: '3ème A', formule: 'Trimestriel', montant: '70.000', statut: 'À jour' },
  { id: '3', eleve: 'Sy Khadija', classe: '6ème B', formule: 'Mensuel', montant: '25.000', statut: 'En retard' },
];

export default function CanteenPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Cantine" description="Menus hebdomadaires et abonnements des élèves." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Repas servis / jour" value="382" subtext="Moyenne semaine" icon={<UtensilsCrossed className="h-5 w-5" />} />
        <StatCard label="Abonnés" value="412" subtext="Élèves inscrits" icon={<Users className="h-5 w-5" />} />
        <StatCard label="Recettes du mois" value="1.840.000" subtext="FCFA" icon={<Wallet className="h-5 w-5" />} />
      </div>

      <h2 className="font-serif text-xl mb-3">Menu de la semaine</h2>
      <DocumentCard className="mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Jour</th>
              <th className="text-left py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Entrée</th>
              <th className="text-left py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Plat principal</th>
              <th className="text-left py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Dessert</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {MENU.map((m) => (
              <tr key={m.jour}>
                <td className="py-3 font-medium">{m.jour}</td>
                <td className="py-3 text-muted-foreground">{m.entree}</td>
                <td className="py-3">{m.plat}</td>
                <td className="py-3 text-muted-foreground">{m.dessert}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DocumentCard>

      <h2 className="font-serif text-xl mb-3">Abonnements récents</h2>
      <DataTable
        columns={[
          { key: 'eleve', header: 'Élève' },
          { key: 'classe', header: 'Classe' },
          { key: 'formule', header: 'Formule' },
          { key: 'montant', header: 'Montant (FCFA)', className: 'tabular-nums text-right' },
          { key: 'statut', header: 'Statut' },
        ]}
        data={ABONNES}
        keyExtractor={(a) => a.id}
      />
    </div>
  );
}