import { Route, Routes } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { GuestOnly, RequireAdmin, RequireAuth, RequireIncompleteProfile, RequireMember } from './routes/guards';
import HomePage from './features/marketing/HomePage';
import NotFoundPage from './features/marketing/NotFoundPage';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import OnboardingPage from './features/profile/OnboardingPage';
import SettingsPage from './features/profile/SettingsPage';
import MySkillsPage from './features/skills/MySkillsPage';
import DiscoverPage from './features/discover/DiscoverPage';
import MemberProfilePage from './features/members/MemberProfilePage';
import RequestsPage from './features/requests/RequestsPage';
import AdminOverviewPage from './features/admin/AdminOverviewPage';
import AdminUsersPage from './features/admin/AdminUsersPage';
import AdminSkillsPage from './features/admin/AdminSkillsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route element={<GuestOnly />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<RequireIncompleteProfile />}>
          <Route path="onboarding" element={<OnboardingPage />} />
        </Route>

        <Route element={<RequireMember />}>
          <Route element={<AppLayout />}>
            <Route path="discover" element={<DiscoverPage />} />
            <Route path="skills" element={<MySkillsPage />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="members/:id" element={<MemberProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route element={<RequireAdmin />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="skills" element={<AdminSkillsPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
