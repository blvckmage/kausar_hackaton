import { useState, useEffect } from 'react';
import { BookOpen, Menu, X, User, Sun, Moon, LogOut, Settings, LayoutGrid, Calendar, Route, Shield, Search, Zap, GraduationCap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { NotificationDropdown } from './NotificationDropdown';

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[var(--card-bg)] backdrop-blur-md border-b border-[var(--border-color)] py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">Mentoria Hub</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/olympiads" className="text-sm font-medium text-[--nav-icon] hover:text-[--text-main] transition-colors flex items-center gap-2">
              <Zap className="w-4 h-4" /> {t('nav.olympiads')}
            </Link>
            <Link to="/courses" className="text-sm font-medium text-[--nav-icon] hover:text-[--text-main] transition-colors flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> {t('nav.courses')}
            </Link>
            <Link to="/profile" className="text-sm font-medium text-[--nav-icon] hover:text-[--text-main] transition-colors flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" /> {t('nav.profile')}
            </Link>
            <Link to="/calendar" className="text-sm font-medium text-[--nav-icon] hover:text-[--text-main] transition-colors flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {t('nav.calendar')}
            </Link>
            <Link to="/roadmap" className="text-sm font-medium text-[--nav-icon] hover:text-[--text-main] transition-colors flex items-center gap-2">
              <Route className="w-4 h-4" /> Roadmap
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-sm font-medium text-[--nav-icon] hover:text-[--text-main] transition-colors flex items-center gap-2">
                <Shield className="w-4 h-4" /> {t('nav.admin')}
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Desktop Language Switcher */}
            <div className="flex items-center bg-[var(--card-bg)] rounded-lg p-1 mr-2 border border-[var(--border-color)]">
              {(['kz', 'ru', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`px-2 py-1 text-xs font-medium rounded-md uppercase transition-colors ${
                    i18n.language === lang 
                      ? 'bg-[var(--accent-from)] text-white' 
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button className="text-[--nav-icon] hover:text-[--text-main] transition-colors p-2">
              <Search className="w-5 h-5" />
            </button>
            
            {user ? (
              <div className="flex items-center gap-4 ml-2">
                <Link to="/profile" className="flex items-center gap-2 text-[--nav-icon] hover:text-[--text-main] transition-colors font-medium">
                  <div className="w-8 h-8 rounded-full bg-[#4f46e5] flex items-center justify-center text-sm text-white font-bold">
                    {user.full_name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <button onClick={handleLogout} className="text-[--nav-icon] hover:text-red-500 p-2">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-[--text-main]" onClick={() => navigate('/login')}>
                  {t('nav.login')}
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')}>{t('nav.start')}</Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <div className="flex items-center bg-white/5 rounded-lg p-1 mr-1 border border-white/10">
              {(['kz', 'ru', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`px-2 py-1 text-xs font-medium rounded-md uppercase transition-colors ${
                    i18n.language === lang 
                      ? 'bg-[--accent-from] text-white' 
                      : 'text-[--text-secondary] hover:text-[--text-primary]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <NotificationDropdown />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[--text-secondary] hover:text-[--accent-from] p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[--bg-main] backdrop-blur-xl border-b border-[--border-color] animate-fade-in-up">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <Link to="/olympiads" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[--text-main] hover:bg-white/5">{t('nav.olympiads')}</Link>
            <Link to="/courses" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[--text-main] hover:bg-white/5">{t('nav.courses')}</Link>
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[--text-main] hover:bg-white/5">{t('nav.profile')}</Link>
            <Link to="/calendar" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[--text-main] hover:bg-white/5">{t('nav.calendar')}</Link>
            <Link to="/roadmap" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[--text-main] hover:bg-white/5">Roadmap</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[--text-main] hover:bg-white/5">{t('nav.admin')}</Link>
            )}
            <div className="pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <Button variant="secondary" className="w-full justify-center" onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}>{t('nav.profile')}</Button>
                  <Button variant="outline" className="w-full justify-center text-red-500 border-red-500/20" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>{t('nav.logout')}</Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" className="w-full justify-center" onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}>{t('nav.login')}</Button>
                  <Button variant="primary" className="w-full justify-center" onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}>{t('nav.start')}</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

