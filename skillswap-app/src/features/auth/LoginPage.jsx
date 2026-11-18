import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Field, FormError, Input } from '../../components/ui';
import { errorMessage } from '../../lib/api';
import { authApi } from './authApi';
import { useAuth } from './authContext';
import { AuthCard } from './AuthCard';
import { PasswordInput } from './PasswordInput';

const schema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  const onSubmit = async (values) => {
    setServerError(null);
    try {
      // The GuestOnly route redirects as soon as the session is stored
      signIn(await authApi.login(values));
    } catch (error) {
      setServerError(errorMessage(error));
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to see your matches and requests."
      footer={
        <>
          New to SkillSwap?{' '}
          <Link to="/signup" className="font-medium text-brand-700 hover:text-brand-800">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormError message={serverError} />
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <PasswordInput autoComplete="current-password" {...register('password')} />
        </Field>
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Log in
        </Button>
      </form>
    </AuthCard>
  );
}
