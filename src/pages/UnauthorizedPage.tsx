import PageHeader from '@/components/PageHeader';
import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="font-serif text-4xl text-foreground mb-2">Accès refusé</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <Link
          to="/"
          className="inline-flex px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
