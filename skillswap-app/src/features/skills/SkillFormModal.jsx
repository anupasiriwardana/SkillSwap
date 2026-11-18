import { useState } from 'react';
import { Controller, useController, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, ChoiceGroup, Field, FormError, Input, Modal, Select, Textarea } from '../../components/ui';
import { applyFieldErrors, errorMessage } from '../../lib/api';
import { LEVELS, MODES, SKILL_TYPES } from '../../lib/constants';
import { SkillNameInput } from './SkillNameInput';

const schema = z
  .object({
    skillName: z.string().trim().min(1, 'Skill name is required').max(80, 'Keep the skill name under 80 characters'),
    type: z.enum(['TEACH', 'LEARN']),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
    mode: z.enum(['ONLINE', 'IN_PERSON', 'BOTH']),
    description: z.string().trim().max(1000, 'Keep the description under 1000 characters').optional(),
    city: z.string().trim().max(100).optional(),
    location: z.string().trim().max(255).optional(),
  })
  .refine((v) => v.mode === 'ONLINE' || (v.city ?? '').length > 0, {
    path: ['city'],
    message: 'City is required for in-person sessions',
  });

const copy = {
  TEACH: {
    title: 'a skill you can teach',
    level: 'Your level',
    description: 'What can you teach?',
    descriptionHint: 'What you know, what you can cover, and who it suits. For example: chords, strumming and simple songs for beginners.',
  },
  LEARN: {
    title: 'a skill you want to learn',
    level: 'Your current level',
    description: 'What do you want to learn?',
    descriptionHint: 'Your goal and where you are now. For example: I can play a few chords and want to learn fingerstyle.',
  },
};

/** Add or edit a teach/learn listing. Pass `listing` to edit. */
export function SkillFormModal({ open, onClose, type, listing, defaultCity, onSubmit }) {
  const [serverError, setServerError] = useState(null);
  const editing = Boolean(listing);
  const kind = listing?.type ?? type;
  const text = copy[kind];

  const {
    control,
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      skillName: listing?.skillName ?? '',
      type: kind,
      level: listing?.level ?? (kind === SKILL_TYPES.TEACH ? 'INTERMEDIATE' : 'BEGINNER'),
      mode: listing?.mode ?? 'ONLINE',
      description: listing?.description ?? '',
      city: listing?.city ?? defaultCity ?? '',
      location: listing?.location ?? '',
    },
  });

  const { field: nameField } = useController({ control, name: 'skillName' });
  const mode = watch('mode');
  const inPerson = mode !== 'ONLINE';

  const submit = async (values) => {
    setServerError(null);
    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      if (!applyFieldErrors(error, setError)) {
        setServerError(errorMessage(error));
      }
    }
  };

  const formId = 'skill-form';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${editing ? 'Edit' : 'Add'} ${text.title}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId} loading={isSubmitting}>
            {editing ? 'Save changes' : 'Add skill'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
        <FormError message={serverError} />

        <Field label="Skill" error={errors.skillName?.message}>
          <SkillNameInput value={nameField.value} onChange={nameField.onChange} onBlur={nameField.onBlur} />
        </Field>

        <Field label={text.level} error={errors.level?.message}>
          <Select {...register('level')}>
            {LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </Select>
        </Field>

        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-700">How do you want to meet?</p>
          <Controller
            control={control}
            name="mode"
            render={({ field }) => <ChoiceGroup name="mode" options={MODES} value={field.value} onChange={field.onChange} />}
          />
        </div>

        {inPerson && (
          <div className="grid gap-5 rounded-lg bg-slate-50 p-4 sm:grid-cols-2">
            <Field label="City" error={errors.city?.message}>
              <Input {...register('city')} />
            </Field>
            <Field label="Area or venue" optional hint="e.g. Near Liberty Plaza" error={errors.location?.message}>
              <Input {...register('location')} />
            </Field>
          </div>
        )}

        <Field label={text.description} optional hint={text.descriptionHint} error={errors.description?.message}>
          <Textarea rows={4} maxLength={1000} {...register('description')} />
        </Field>
      </form>
    </Modal>
  );
}
