'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  username: z.string().min(2).max(50)
});

type FormType = 'sign-in' | 'sign-up';

const AuthForm = ({ type }: { type: FormType }) => {
  return <div></div>;
};

export default AuthForm;
