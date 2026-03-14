import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import DocumentCard from '@/components/DocumentCard';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Shield, Users, Clock } from 'lucide-react';
import { UserRole } from '@/stores/authStore';

interface AppUser {
  id: string;
  nom: string;
  email: string;
  role: UserRole;
  createdAt: string;
  actif: boolean;
}

const MOCK_USERS: AppUser[] = [
  { id: '1', nom: 'Administrateur Principal', email: 'admin@gestscolaire.com', role: 'ADMIN', createdAt: '01/09/2024', actif: true },
  { id: '2', nom: 'M. Ndongo', email: 'directeur@gestscolaire.com', role: 'DIRECTEUR', createdAt: '01/09/2024', actif: true },
  { id: '3', nom: 'Mme Faye', email: 'comptable@gestscolaire.com', role: 'COMPTABLE', createdAt: '05/09/2024', actif: true },
  { id: '4', nom: 'M. Sall', email: 'sall@gestscolaire.com', role: 'COMPTABLE', createdAt: '10/09/2024', actif: false },
];

interface TaxConfig {
  id: string;
  label: string;
  taux: number;
  effectiveDate: string;
}

const MOCK_TAX: TaxConfig[] = [
  { id: '1', label: 'Impôt sur le revenu', taux: 13, effectiveDate: '01/01/2024' },
  { id: '2', label: 'Cotisation sociale', taux: 5.5, effectiveDate: '01/01/2024' },
];

interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  detail: string;
}

const MOCK_AUDIT: AuditEntry[] = [
  { id: '1', action: 'CREATE_USER', user: 'admin@gestscolaire.com', timestamp: '14/10/2024 09:12', detail: 'Création utilisateur M. Sall (COMPTABLE)' },
  { id: '2', action: 'CLOSE_MONTH', user: 'comptable@gestscolaire.com', timestamp: '01/10/2024 18:30', detail: 'Clôture mois Septembre 2024' },
  { id: '3', action: 'UPDATE_TAX', user: 'admin@gestscolaire.com', timestamp: '15/09/2024 10:00', detail: 'Modification taux IR: 12% → 13%' },
  { id: '4', action: 'GENERATE_PDF', user: 'directeur@gestscolaire.com', timestamp: '12/10/2024 14:22', detail: 'Bulletin scolaire — 3ème A T1' },
];

const userSchema = z.object({
  nom: z.string().min(2, 'Minimum 2 caractères').max(100),
  email: z.string().email('E-mail invalide').max(255),
  role: z.enum(['ADMIN', 'DIRECTEUR', 'COMPTABLE']),
  password: z.string().min(8, 'Minimum 8 caractères'),
});

type UserForm = z.infer<typeof userSchema>;

export default function AdminPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'taxes' | 'audit'>('users');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data: UserForm) => {
    setUsers([
      {
        id: String(users.length + 1),
        nom: data.nom,
        email: data.email,
        role: data.role,
        createdAt: new Date().toLocaleDateString('fr-FR'),
        actif: true,
      },
      ...users,
    ]);
    setShowForm(false);
    reset();
  };

  const roleColors: Record<UserRole, 'warning' | 'success' | 'neutral'> = {
    ADMIN: 'warning',
    DIRECTEUR: 'success',
    COMPTABLE: 'neutral',
  };

  const tabs = [
    { key: 'users' as const, label: 'Utilisateurs', icon: Users },
    { key: 'taxes' as const, label: 'Configuration fiscale', icon: Shield },
    { key: 'audit' as const, label: 'Journal d\'audit', icon: Clock },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Administration" description="Gestion des utilisateurs, configuration système et journal d'audit." />

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.key
                ? 'border-accent text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity"
            >
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm ? 'Annuler' : 'Nouvel utilisateur'}
            </button>
          </div>

          {showForm && (
            <DocumentCard className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Créer un utilisateur</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Nom complet</label>
                  <input {...register('nom')} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent" />
                  {errors.nom && <p className="mt-1 text-xs text-destructive">{errors.nom.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">E-mail</label>
                  <input {...register('email')} type="email" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent" />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Rôle</label>
                  <select {...register('role')} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent">
                    <option value="COMPTABLE">Comptable</option>
                    <option value="DIRECTEUR">Directeur</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Mot de passe</label>
                  <input {...register('password')} type="password" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent" />
                  {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
                </div>
                <div className="flex items-end">
                  <button type="submit" className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity">Créer</button>
                </div>
              </form>
            </DocumentCard>
          )}

          <DataTable
            columns={[
              { key: 'nom', header: 'Nom', render: (u: AppUser) => <span className="font-medium">{u.nom}</span> },
              { key: 'email', header: 'E-mail', className: 'font-mono text-xs' },
              { key: 'role', header: 'Rôle', render: (u: AppUser) => <StatusBadge status={roleColors[u.role]} label={u.role} /> },
              { key: 'createdAt', header: 'Créé le', className: 'tabular-nums' },
              { key: 'actif', header: 'Statut', render: (u: AppUser) => <StatusBadge status={u.actif ? 'success' : 'neutral'} label={u.actif ? 'Actif' : 'Inactif'} /> },
            ]}
            data={users}
            keyExtractor={(u) => u.id}
          />
        </>
      )}

      {/* Taxes Tab */}
      {activeTab === 'taxes' && (
        <DocumentCard>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Taux d'imposition en vigueur</h3>
          <div className="divide-y divide-border">
            {MOCK_TAX.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.label}</p>
                  <p className="text-xs text-muted-foreground">Effectif depuis le {t.effectiveDate}</p>
                </div>
                <span className="text-lg font-serif tabular-nums text-accent">{t.taux}%</span>
              </div>
            ))}
          </div>
        </DocumentCard>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <DataTable
          columns={[
            { key: 'timestamp', header: 'Date', className: 'tabular-nums text-xs whitespace-nowrap' },
            { key: 'action', header: 'Action', render: (a: AuditEntry) => <span className="font-mono text-xs">{a.action}</span> },
            { key: 'user', header: 'Utilisateur', className: 'font-mono text-xs' },
            { key: 'detail', header: 'Détail', render: (a: AuditEntry) => <span className="text-muted-foreground">{a.detail}</span> },
          ]}
          data={MOCK_AUDIT}
          keyExtractor={(a) => a.id}
        />
      )}
    </div>
  );
}
