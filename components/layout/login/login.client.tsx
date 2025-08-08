'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const t = useTranslations('login');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [previousEmails, setPreviousEmails] = useState<string[]>([]);

  const correctEmail = process.env.CORRECT_EMAIL;
  const correctPassword = process.env.CORRECT_PASSWORD;
  useEffect(() => {
    const savedEmail = localStorage.getItem('login_email');
    const savedPassword = localStorage.getItem('login_password');
    const savedEmailsList = JSON.parse(localStorage.getItem('emails_list') || '[]');

    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
    setPreviousEmails(savedEmailsList);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('login_email', email);
    localStorage.setItem('login_password', password);
    if (!previousEmails.includes(email)) {
      const updatedList = [...previousEmails, email];
      setPreviousEmails(updatedList);
      localStorage.setItem('emails_list', JSON.stringify(updatedList));
    }
    if (email === correctEmail && password === correctPassword) {
      sessionStorage.setItem('isAdmin', 'true');
      router.push('/dashboard');
    } else {
      toast.error(t('sonner'));
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grid dark:bg-grid">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-black border dark:border-white/45 border-black/40 p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">{t('title')}</h1>
        <input
          list="emails"
          type="email"
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        <datalist id="emails">
          {previousEmails.map((em, idx) => (
            <option key={idx} value={em} />
          ))}
        </datalist>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder={t('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        >
          {t('button')}
        </button>
      </form>
    </div>
  );
}
