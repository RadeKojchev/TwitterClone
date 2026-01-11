'use client';
import { useState } from 'react';
import { authService } from '../../src/services/auth.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(formData);
      alert('Успешна регистрација! Сега најави се.');
      router.push('/login');
    } catch (error) {
      alert('Грешка при регистрација. Можеби корисничкото име е зафатено.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl">
        <h2 className="text-center text-2xl font-bold text-gray-900 italic font-serif">Приклучи се на Twitter</h2>
        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Име и презиме"
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-black focus:border-blue-500 focus:outline-none"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Корисничко име (@username)"
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-black focus:border-blue-500 focus:outline-none"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-black focus:border-blue-500 focus:outline-none"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Лозинка"
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-black focus:border-blue-500 focus:outline-none"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-black py-3 font-bold text-white transition hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? 'Се процесира...' : 'Креирај профил'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Веќе имаш профил? <Link href="/login" className="font-semibold text-blue-500 hover:underline">Најави се</Link>
        </p>
      </div>
    </div>
  );
}