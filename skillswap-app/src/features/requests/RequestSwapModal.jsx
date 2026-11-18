import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button, Field, FormError, Modal, Select, Textarea } from '../../components/ui';
import { errorMessage } from '../../lib/api';
import { SKILL_TYPES } from '../../lib/constants';
import { ME_QUERY_KEY } from '../auth/authContext';
import { discoverKeys } from '../discover/discoverApi';
import { skillKeys, skillsApi } from '../skills/skillsApi';
import { requestKeys, requestsApi } from './requestsApi';

/**
 * Ask a member for a swap.
 * @param theirTeaching  their TEACH listings to choose from
 * @param theyWantSkillIds skill ids they want to learn, used to pre-select what to offer
 */
export function RequestSwapModal({ open, onClose, member, theirTeaching, theyWantSkillIds = [] }) {
  const queryClient = useQueryClient();
  const myTeachingQuery = useQuery({ queryKey: skillKeys.mine, queryFn: skillsApi.listMine, enabled: open });
  const myTeaching = (myTeachingQuery.data ?? []).filter((l) => l.type === SKILL_TYPES.TEACH);

  const suggestedOffer = myTeaching.find((l) => theyWantSkillIds.includes(l.skillId));
  const [requestedSkillId, setRequestedSkillId] = useState(String(theirTeaching[0]?.skillId ?? ''));
  const [offeredSkillId, setOfferedSkillId] = useState(null);
  const [message, setMessage] = useState('');
  const offerValue = offeredSkillId ?? String(suggestedOffer?.skillId ?? '');

  const mutation = useMutation({
    mutationFn: () =>
      requestsApi.send({
        recipientId: member.id,
        requestedSkillId: Number(requestedSkillId),
        offeredSkillId: offerValue ? Number(offerValue) : null,
        message: message.trim() || null,
      }),
    onSuccess: () => {
      toast.success(`Request sent to ${member.firstName}`);
      queryClient.invalidateQueries({ queryKey: discoverKeys.all });
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
      queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
      onClose();
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Request a swap with ${member.firstName}`}
      description="They will see your profile and message. If they accept, you both get each other's contact details."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!requestedSkillId}>
            Send request
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <FormError message={mutation.isError ? errorMessage(mutation.error) : null} />

        <Field label={`What do you want to learn from ${member.firstName}?`}>
          <Select value={requestedSkillId} onChange={(e) => setRequestedSkillId(e.target.value)}>
            {theirTeaching.map((listing) => (
              <option key={listing.id} value={listing.skillId}>
                {listing.skillName}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="What can you teach in return?"
          optional
          hint={myTeaching.length === 0 ? 'Add skills you teach on the My skills page to offer one here.' : undefined}
        >
          <Select value={offerValue} onChange={(e) => setOfferedSkillId(e.target.value)}>
            <option value="">Nothing specific</option>
            {myTeaching.map((listing) => (
              <option key={listing.id} value={listing.skillId}>
                {listing.skillName}
                {theyWantSkillIds.includes(listing.skillId) ? ' (they want to learn this)' : ''}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Message" optional hint={`${message.length}/500`}>
          <Textarea
            rows={4}
            maxLength={500}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Hi ${member.firstName}, I'd love to learn from you. I'm free most weekday evenings.`}
          />
        </Field>
      </div>
    </Modal>
  );
}
