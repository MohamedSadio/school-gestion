import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Wallet,
  Banknote,
  Shield,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { title: 'Tableau de bord', url: '/', icon: LayoutDashboard },
  { title: 'Élèves', url: '/students', icon: GraduationCap, roles: ['ADMIN', 'DIRECTEUR'] },
  { title: 'Notes & Bulletins', url: '/grades', icon: FileText, roles: ['ADMIN', 'DIRECTEUR'] },
  { title: 'Documents', url: '/documents', icon: FileText, roles: ['ADMIN', 'DIRECTEUR', 'COMPTABLE'] },
  { title: 'Finances', url: '/finance', icon: Wallet, roles: ['ADMIN', 'COMPTABLE'] },
  { title: 'Paie', url: '/payroll', icon: Banknote, roles: ['ADMIN', 'COMPTABLE'] },
  { title: 'Utilisateurs', url: '/admin/users', icon: Users, roles: ['ADMIN'] },
  { title: 'Administration', url: '/admin', icon: Shield, roles: ['ADMIN'] },
];

export default function AppSidebar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <aside
      className={cn(
        'flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-200 shrink-0',
        collapsed ? 'w-16' : 'w-[260px]'
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div>
            <h2 className="font-serif text-lg leading-tight text-sidebar-foreground">
              GestScolaire
            </h2>
            <p className="text-xs text-sidebar-muted">Direction & Excellence</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-sm hover:bg-sidebar-accent transition-colors"
        >
          <ChevronLeft
            className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive =
            item.url === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.url);

          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-foreground font-medium'
                  : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed && user && (
          <div className="mb-2 px-2">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
            <p className="text-xs text-sidebar-muted">{user.role}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-sm transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
