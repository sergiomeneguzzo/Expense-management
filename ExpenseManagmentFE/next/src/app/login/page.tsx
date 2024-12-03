'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Invalid credentials');
      }

      const data = await response.json();
      alert(`Welcome, ${data.username}!`);

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader>
          <h2 className='text-xl font-semibold'>Login</h2>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className='space-y-4'>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type='submit' className='w-full'>
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
