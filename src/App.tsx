import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import StudentsPage from "@/pages/StudentsPage";
import StudentDetailPage from "@/pages/StudentDetailPage";
import ClassesPage from "@/pages/ClassesPage";
import ClassDetailPage from "@/pages/ClassDetailPage";
import CalendarPage from "@/pages/CalendarPage";
import TransportPage from "@/pages/TransportPage";
import CanteenPage from "@/pages/CanteenPage";
import UniformsPage from "@/pages/UniformsPage";
import SettingsPage from "@/pages/SettingsPage";
import SubscriptionPage from "@/pages/SubscriptionPage";
import GradesPage from "@/pages/GradesPage";
import DocumentsPage from "@/pages/DocumentsPage";
import FinancePage from "@/pages/FinancePage";
import PayrollPage from "@/pages/PayrollPage";
import AdminPage from "@/pages/AdminPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['ADMIN', 'DIRECTEUR']} />}>
            <Route element={<AppLayout />}>
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/students/:id" element={<StudentDetailPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/classes/:id" element={<ClassDetailPage />} />
              <Route path="/grades" element={<GradesPage />} />
              <Route path="/transport" element={<TransportPage />} />
              <Route path="/canteen" element={<CanteenPage />} />
              <Route path="/uniforms" element={<UniformsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['ADMIN', 'COMPTABLE']} />}>
            <Route element={<AppLayout />}>
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/payroll" element={<PayrollPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
