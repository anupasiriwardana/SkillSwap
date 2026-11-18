import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Field, FormError, Input, Textarea } from '../../components/ui';
import { applyFieldErrors, errorMessage } from '../../lib/api';

const optional = (max) => z.string().trim().max(max).optional().or(z.literal(''));

const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  headline: optional(120),
  about: z.string().trim().min(1, 'Tell others a little about yourself').max(2000, 'Keep this under 2000 characters'),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(/^[+0-9 ()-]{7,30}$/, 'Enter a valid phone number'),
  country: z.string().trim().min(1, 'Country is required').max(100),
  city: z.string().trim().min(1, 'City is required').max(100),
  address: optional(255),
});

const toDefaults = (profile) => ({
  firstName: profile?.firstName ?? '',
  lastName: profile?.lastName ?? '',
  headline: profile?.headline ?? '',
  about: profile?.about ?? '',
  phone: profile?.phone ?? '',
  country: profile?.country ?? '',
  city: profile?.city ?? '',
  address: profile?.address ?? '',
});

/** Shared by onboarding and settings. `onSubmit` should return a promise. */
export function ProfileForm({ profile, onSubmit, submitLabel }) {
  const [serverError, setServerError] = useState(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({ resolver: zodResolver(profileSchema), defaultValues: toDefaults(profile) });

  const submit = async (values) => {
    setServerError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      if (!applyFieldErrors(error, setError)) {
        setServerError(errorMessage(error));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-8" noValidate>
      <FormError message={serverError} />

      <section className="space-y-5">
        <SectionTitle title="About you" description="This is what other members see on your profile." />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="First name" error={errors.firstName?.message}>
            <Input autoComplete="given-name" {...register('firstName')} />
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            <Input autoComplete="family-name" {...register('lastName')} />
          </Field>
        </div>
        <Field
          label="Headline"
          optional
          hint="A short line, for example: Software engineer and weekend guitarist"
          error={errors.headline?.message}
        >
          <Input maxLength={120} {...register('headline')} />
        </Field>
        <Field
          label="About me"
          hint="What do you do, what do you enjoy, and how do you like to learn?"
          error={errors.about?.message}
        >
          <Textarea rows={5} maxLength={2000} {...register('about')} />
        </Field>
      </section>

      <section className="space-y-5 border-t border-slate-100 pt-8">
        <SectionTitle
          title="Contact and location"
          description="Your phone number and address are only shared with members whose request you accept, or who accept yours."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone number" error={errors.phone?.message}>
            <Input type="tel" autoComplete="tel" placeholder="+94 77 123 4567" {...register('phone')} />
          </Field>
          <Field label="Country" error={errors.country?.message}>
            <Input autoComplete="country-name" {...register('country')} />
          </Field>
          <Field label="City" error={errors.city?.message}>
            <Input autoComplete="address-level2" {...register('city')} />
          </Field>
          <Field label="Address" optional error={errors.address?.message}>
            <Input autoComplete="street-address" {...register('address')} />
          </Field>
        </div>
      </section>

      <div className="flex justify-end border-t border-slate-100 pt-6">
        <Button type="submit" loading={isSubmitting} disabled={profile?.about && !isDirty}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function SectionTitle({ title, description }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  );
}
