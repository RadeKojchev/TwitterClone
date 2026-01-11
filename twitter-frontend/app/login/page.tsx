'use client';
import { useState } from 'react';
import { authService } from '../../src/services/auth.service'; // Релативна патека до твојот сервис
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.login({ email, password });
      router.push('/'); // Не префрла на почетната страна (Feed) 
    } catch (error) {
      alert('Грешка при најава. Проверете ги мејлот и лозинката.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl">
        <div className="flex justify-center text-blue-500 text-4xl font-bold">𝕏</div>
        <h2 className="mt-4 text-center text-2xl font-bold text-gray-900 italic">Најава</h2>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-black focus:border-blue-500 focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Лозинка"
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-black focus:border-blue-500 focus:outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-blue-500 py-3 font-bold text-white transition hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Се вчитува...' : 'Најави се'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Немаш профил? <Link href="/register" className="font-semibold text-blue-500 hover:underline">Креирај профил тука</Link>
        </p>
      </div>
    </div>
  );
}