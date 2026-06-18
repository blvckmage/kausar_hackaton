import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email.trim() || !password.trim()) {
      setErrorMsg(t('auth.enter_details'));
      return;
    }
    setIsLoading(true);

    let loginEmail = email.trim();
    let loginPassword = password.trim();

    // Быстрый вход для админа (Хакатон мод)
    if (loginEmail.toLowerCase() === 'admin' && loginPassword === 'admin') {
      loginEmail = 'admin1@mentoria.com';
      loginPassword = 'admin123';
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;
      navigate('/profile');
    } catch (error: any) {
      console.error(error);
      const errStr = typeof error === 'object' ? JSON.stringify(error) : String(error);
      setErrorMsg(`Ошибка: ${error?.message || errStr}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[--accent-from] opacity-20 blur-[120px] animate-blob pointer-events-none -z-10" />
      <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-[--accent-to] opacity-20 blur-[120px] animate-blob-delayed pointer-events-none -z-10" />

      <Link to="/" className="flex items-center gap-2 mb-8 animate-fade-in-up">
        <div className="p-2 bg-gradient-to-br from-[--accent-from] to-[--accent-to] rounded-xl">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <span className="text-3xl font-bold tracking-tight text-[--text-primary]">
          Mentoria<span className="text-[--accent-from]">Hub</span>
        </span>
      </Link>

      <Card className="w-full max-w-md animate-fade-in-up relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[--text-primary] mb-2">{t('auth.welcome_back')}</h1>
          <p className="text-[--text-secondary]">{t('auth.enter_details')}</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[--text-secondary]">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[--bg-primary] border border-[--border-color] rounded-lg py-3 pl-10 pr-4 text-[--text-primary] focus:outline-none focus:border-[--accent-from] transition-colors relative z-10"
                placeholder="name@example.com (или логин)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[--text-secondary]">{t('auth.password')}</label>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-[--accent-from] hover:underline relative z-10">{t('auth.forgot_password')}</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[--bg-primary] border border-[--border-color] rounded-lg py-3 pl-10 pr-4 text-[--text-primary] focus:outline-none focus:border-[--accent-from] transition-colors relative z-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-6 cursor-pointer relative z-20" disabled={isLoading}>
            {isLoading ? t('auth.login_loading') : t('auth.login_btn')} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-[--text-secondary] relative z-10">
          {t('auth.no_account')}{' '}
          <Link to="/register" className="text-[--accent-from] hover:underline font-medium relative z-10">
            {t('auth.register_link')}
          </Link>
        </div>
      </Card>
    </div>
  );
}
