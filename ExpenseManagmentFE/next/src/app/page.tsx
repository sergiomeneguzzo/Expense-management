// /app/home/page.tsx
'use client';

import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/login');

  return null;
}
