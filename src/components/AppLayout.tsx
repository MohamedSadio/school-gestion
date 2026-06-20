import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { useAuthStore } from '@/stores/authStore';

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-border bg-background shrink-0">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-xs md:text-sm text-muted-foreground truncate">
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-6 md:pt-8 pb-16 md:pb-24">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
