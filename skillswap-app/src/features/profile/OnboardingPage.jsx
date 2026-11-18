import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card } from '../../components/ui';
import { Logo } from '../../components/layout/Logo';
import { UserMenu } from '../../components/layout/UserMenu';
import { ME_QUERY_KEY, useAuth } from '../auth/authContext';
import { profileApi, profileKeys } from './profileApi';
import { ProfileForm } from './ProfileForm';

/** First stop after signing up: members must complete their profile before using the app. */
export default function OnboardingPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleSubmit = async (values) => {
    const saved = await profileApi.saveMine(values);
    queryClient.setQueryData(profileKeys.mine, saved);
    queryClient.setQueryData(ME_QUERY_KEY, (current) => ({
      ...current,
      firstName: saved.firstName,
      lastName: saved.lastName,
      profileCompleted: true,
    }));
    // RequireIncompleteProfile now redirects to /skills
    toast.success('Profile saved. Now add the skills you teach and want to learn.');
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="border-b border-slate-200 bg-white">
        <div className="page flex h-16 items-center justify-between">
          <Logo to="/onboarding" />
          <UserMenu showProfileLinks={false} />
        </div>
      </header>

      <main className="page max-w-3xl py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-brand-600">Step 1 of 2</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Welcome, {user.firstName}. Let&apos;s set up your profile.
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            A clear profile helps people decide to swap with you. Next, you&apos;ll add your skills.
          </p>
        </div>
        <Card className="p-6 sm:p-8">
          <ProfileForm
            profile={{ firstName: user.firstName, lastName: user.lastName }}
            onSubmit={handleSubmit}
            submitLabel="Save and continue"
          />
        </Card>
      </main>
    </div>
  );
}
