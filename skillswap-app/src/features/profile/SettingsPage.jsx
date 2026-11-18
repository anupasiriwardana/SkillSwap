import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, ErrorState, FullPageSpinner, PageHeader } from '../../components/ui';
import { errorMessage } from '../../lib/api';
import { formatMonth } from '../../lib/format';
import { ME_QUERY_KEY } from '../auth/authContext';
import { discoverKeys } from '../discover/discoverApi';
import { profileApi, profileKeys } from './profileApi';
import { ProfileForm } from './ProfileForm';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({ queryKey: profileKeys.mine, queryFn: profileApi.getMine });

  const handleSubmit = async (values) => {
    const saved = await profileApi.saveMine(values);
    queryClient.setQueryData(profileKeys.mine, saved);
    queryClient.setQueryData(ME_QUERY_KEY, (current) => ({
      ...current,
      firstName: saved.firstName,
      lastName: saved.lastName,
    }));
    queryClient.invalidateQueries({ queryKey: discoverKeys.all });
    toast.success('Profile updated');
  };

  if (profileQuery.isPending) return <FullPageSpinner />;
  if (profileQuery.isError) {
    return <ErrorState message={errorMessage(profileQuery.error)} onRetry={profileQuery.refetch} />;
  }

  const profile = profileQuery.data;
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Profile settings"
        description={`${profile.email} · Member since ${formatMonth(profile.memberSince)}`}
      />
      <Card className="p-6 sm:p-8">
        {/* key resets the form after a save so "dirty" tracking starts fresh */}
        <ProfileForm key={profileQuery.dataUpdatedAt} profile={profile} onSubmit={handleSubmit} submitLabel="Save changes" />
      </Card>
    </div>
  );
}
