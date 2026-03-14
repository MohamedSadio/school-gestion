import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/stores/authStore';

interface ProtectedRouteProps {
  roles?: UserRole[];
}

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
