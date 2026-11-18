import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Field, FormError, Input } from '../../components/ui';
import { applyFieldErrors, errorMessage } from '../../lib/api';
import { authApi } from './authApi';
import { useAuth } from './authContext';
import { AuthCard } from './AuthCard';
import { PasswordInput } from './PasswordInput';

const schema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(8, 'Use at least 8 characters').max(72, 'Use 72 characters or fewer'),
});

export default function SignupPage() {
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
  });

  const onSubmit = async (values) => {
    setServerError(null);
    try {
      // New accounts land on onboarding via the GuestOnly redirect
      signIn(await authApi.register(values));
    } catch (error) {
      if (!applyFieldErrors(error, setError)) {
        setServerError(errorMessage(error));
      }
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start swapping skills with people near you or online."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-700 hover:text-brand-800">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormError message={serverError} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="First name" error={errors.firstName?.message}>
            <Input autoComplete="given-name" {...register('firstName')} />
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            <Input autoComplete="family-name" {...register('lastName')} />
          </Field>
        </div>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} />
        </Field>
        <Field label="Password" hint="At least 8 characters." error={errors.password?.message}>
          <PasswordInput autoComplete="new-password" {...register('password')} />
        </Field>
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
