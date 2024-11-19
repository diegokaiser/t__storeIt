'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createAccount } from '@/lib/actions/user-actions';

type FormType = 'sign-in' | 'sign-up';

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName:
      formType === 'sign-in' ? z.string().min(2).max(50) : z.string().optional()
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [accountId, setAccountId] = useState(null);

  const formSchema = authFormSchema(type);
  // form definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: ''
    }
  });

  // submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setIsLoading(true);
    setErrorMessage('');
    try {
      {
        /**
        const user = await createAccount({
          fullName: values.fullName || '',
          email: values.email
        });
        setAccountId(user.accountId);
      */
      }
      console.log('enviando valores a createAccount');
      console.log('todo gucci');
    } catch (error) {
      setErrorMessage('Failed to create account. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === 'sign-in' ? 'Sign in' : 'Sign Up'}
          </h1>
          {type === 'sign-in' && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Username</FormLabel>
                    <FormControl>
                      <Input
                        className="shad-input"
                        placeholder="Enter your full name"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="shad-input"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <Image
                src="/assets/icons/loader.svg"
                alt="Loading..."
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            ) : (
              <>{type === 'sign-in' ? 'Sign In' : 'Sign Up'}</>
            )}
          </Button>
          {errorMessage && <p className="error-message">*{errorMessage}</p>}
          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === 'sign-in'
                ? "Don't have an account?"
                : 'Already have an account'}
            </p>

            <Link
              href={type === 'sign-in' ? '/sign-up' : 'sign-in'}
              className="ml-1 font-medium text-brand"
            >
              {type === 'sign-in' ? 'Create Account' : 'Login'}
            </Link>
          </div>
        </form>
      </Form>
      {/* OTP validation */}
    </>
  );
};

export default AuthForm;
