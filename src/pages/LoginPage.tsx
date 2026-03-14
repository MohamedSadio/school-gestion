import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
import { Lock, AlertTriangle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Adresse e-mail invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

type LoginForm = z.infer<typeof loginSchema>;

// Demo users for frontend-only mode
const DEMO_USERS = [
  { email: 'admin@gestscolaire.com', password: 'admin', user: { id: '1', name: 'Administrateur Principal', email: 'admin@gestscolaire.com', role: 'ADMIN' as const } },
  { email: 'directeur@gestscolaire.com', password: 'directeur', user: { id: '2', name: 'M. Ndongo', email: 'directeur@gestscolaire.com', role: 'DIRECTEUR' as const } },
  { email: 'comptable@gestscolaire.com', password: 'comptable', user: { id: '3', name: 'Mme Faye', email: 'comptable@gestscolaire.com', role: 'COMPTABLE' as const } },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth, incrementAttempts, resetAttempts, isLocked, loginAttempts } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    if (isLocked()) {
      setError('Compte verrouillé. Veuillez réessayer dans 15 minutes.');
      return;
    }

    // Demo authentication
    const demoUser = DEMO_USERS.find(
      (u) => u.email === data.email && u.password === data.password
    );

    if (demoUser) {
      resetAttempts();
      setAuth(demoUser.user, 'demo-token', 'demo-refresh');
      navigate('/');
    } else {
      incrementAttempts();
      const remaining = 5 - (loginAttempts + 1);
      if (remaining <= 0) {
        setError('Compte verrouillé après 5 tentatives échouées.');
      } else {
        setError(`Identifiants incorrects. ${remaining} tentative(s) restante(s).`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-foreground mb-2">GestScolaire</h1>
          <p className="text-sm text-muted-foreground">Direction et Excellence Académique</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Connexion
            </h2>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-destructive/5 border border-destructive/20 rounded-sm">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Adresse e-mail
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                placeholder="nom@etablissement.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Mot de passe
              </label>
              <input
                {...register('password')}
                type="password"
                className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLocked()}
              className="w-full py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isSubmitting ? 'Connexion en cours…' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Comptes de démonstration :</p>
            <div className="space-y-1">
              {DEMO_USERS.map((u) => (
                <p key={u.email} className="text-xs text-muted-foreground font-mono">
                  {u.email} / {u.password}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
