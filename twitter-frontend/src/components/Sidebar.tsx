'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon, LogOut, Home, User, Twitter, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Додаден useRouter
import api from '../lib/axios';
import { notificationService } from '../services/notification.service';

export default function Sidebar() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // ПРОВЕРКА: Извршувај повици само ако има токен
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
      fetchUnreadCount();
      
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [pathname]);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setCurrentUser(res.data);
    } catch (err: any) {
      // Ако бекендот врати 401, значи токенот е невалиден/истечен
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        // Не правиме console.error за да не го полниме логот при logout
      }
    }
  };

  const fetchUnreadCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return; // Не пробувај ако нема токен

    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err: any) {
      if (err.response?.status !== 401) {
        console.error("Грешка при вчитување на бројот на нотификации", err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setUnreadCount(0);
    router.push('/login'); // Редирект до login
  };

  if (!mounted) {
    return <aside className="fixed w-64 h-screen p-4 border-r border-[var(--border)] bg-[var(--background)]" />;
  }

  // Ако нема корисник, не ја прикажувај навигацијата (опционално, зависи од твојот дизајн)
  // Најчесто Sidebar-от не треба да прави API повици ако сме на /login страница
  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <aside className="fixed w-64 h-screen p-4 flex flex-col justify-between border-r border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] z-20">
      <div>
        <div className="p-3 mb-2 text-[#1d9bf0]">
          <Twitter size={30} fill="currentColor" />
        </div>

        <nav className="space-y-1">
          <Link href="/" className="flex items-center space-x-4 p-3 hover:bg-gray-200/50 dark:hover:bg-zinc-900 rounded-full transition w-fit pr-6">
            <Home size={26} />
            <span className="text-xl font-medium">Дома</span>
          </Link>

          <Link href="/notifications" className="flex items-center space-x-4 p-3 hover:bg-gray-200/50 dark:hover:bg-zinc-900 rounded-full transition w-fit pr-6 relative">
            <div className="relative">
              <Bell size={26} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1d9bf0] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-[var(--background)]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span className="text-xl font-medium">Известувања</span>
          </Link>
          
          <Link 
            href={currentUser ? `/profile/${currentUser.username}` : '#'} 
            className="flex items-center space-x-4 p-3 hover:bg-gray-200/50 dark:hover:bg-zinc-900 rounded-full transition w-fit pr-6"
          >
            <User size={26} />
            <span className="text-xl font-medium">Профил</span>
          </Link>
        </nav>
      </div>

      <div className="space-y-2 pb-4">
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="flex items-center space-x-4 w-full p-3 hover:bg-gray-200/50 dark:hover:bg-zinc-900 rounded-full transition text-xl font-medium"
        >
          {resolvedTheme === 'dark' ? (
            <><Sun size={26} className="text-yellow-400" /> <span>Светол режим</span></>
          ) : (
            <><Moon size={26} className="text-blue-500" /> <span>Темен режим</span></>
          )}
        </button>

        <button 
          onClick={handleLogout}
          className="flex items-center space-x-4 w-full p-3 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-full transition text-xl font-bold"
        >
          <LogOut size={26} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}