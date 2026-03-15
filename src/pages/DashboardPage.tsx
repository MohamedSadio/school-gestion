import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import DocumentCard from '@/components/DocumentCard';
import { useAuthStore } from '@/stores/authStore';
import { GraduationCap, Users, Wallet, FileText, TrendingUp, AlertCircle } from 'lucide-react';

const recentActivities = [
  { id: '1', action: 'Inscription élève', detail: 'Amadou Diallo — 3ème A', time: 'Il y a 2h' },
  { id: '2', action: 'Paiement reçu', detail: '150.000 FCFA — Facture #2024-0891', time: 'Il y a 3h' },
  { id: '3', action: 'Bulletin généré', detail: 'Classe 6ème B — Trimestre 1', time: 'Il y a 5h' },
  { id: '4', action: 'Clôture mensuelle', detail: 'Octobre 2024 — Journal verrouillé', time: 'Hier' },
  { id: '5', action: 'Nouveau utilisateur', detail: 'M. Ndiaye — Rôle COMPTABLE', time: 'Hier' },
];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Bienvenue, ${user?.name?.split(' ')[0] || 'Utilisateur'}`}
        titleClassName="font-mono"
        description={`Vue d'ensemble de votre établissement — ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {(role === 'ADMIN' || role === 'DIRECTEUR') && (
          <>
            <StatCard
              label="Élèves inscrits"
              value="1.247"
              subtext="Année 2024–2025"
              icon={<GraduationCap className="h-5 w-5" />}
            />
            <StatCard
              label="Enseignants"
              value="68"
              subtext="+3 ce trimestre"
              icon={<Users className="h-5 w-5" />}
            />
          </>
        )}
        {(role === 'ADMIN' || role === 'COMPTABLE') && (
          <>
            <StatCard
              label="Recettes du mois"
              value="12.450.000"
              subtext="FCFA — Octobre 2024"
              icon={<Wallet className="h-5 w-5" />}
            />
            <StatCard
              label="Impayés"
              value="2.130.000"
              subtext="FCFA — 47 factures"
              icon={<AlertCircle className="h-5 w-5" />}
            />
          </>
        )}
        {role === 'DIRECTEUR' && (
          <>
            <StatCard
              label="Moyenne générale"
              value="13,4"
              subtext="/20 — Toutes classes"
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <StatCard
              label="Bulletins générés"
              value="312"
              subtext="Trimestre 1"
              icon={<FileText className="h-5 w-5" />}
            />
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DocumentCard>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Activité récente
            </h3>
            <div className="divide-y divide-border">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{activity.time}</span>
                </div>
              ))}
            </div>
          </DocumentCard>
        </div>

        <div>
          <DocumentCard>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Année scolaire
            </h3>
            <p className="font-serif text-2xl text-foreground mb-1">2024 – 2025</p>
            <p className="text-xs text-muted-foreground mb-4">Trimestre 1 en cours</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Début</span>
                <span className="text-foreground tabular-nums">02 Sept. 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fin T1</span>
                <span className="text-foreground tabular-nums">15 Déc. 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fin année</span>
                <span className="text-foreground tabular-nums">30 Juin 2025</span>
              </div>
            </div>
          </DocumentCard>
        </div>
      </div>
    </div>
  );
}
